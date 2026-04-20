import fs from 'fs/promises';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);

export type GalleryItem = {
  src: string;
  alt: string;
  fileName: string;
  category: string;
  label: string;
};

const FACULTY_LABELS: Record<string, string> = {
  'UstAmina.jpg': 'Ustadha Amina Abdiqadir',
  'UstNasser.jpeg': 'Ustadh Nasser Abdulaziz',
  'UstMusa.jpeg': 'Ustadh Musa Anis',
  'UstMusa.jpg': 'Ustadh Musa Anis',
  'UstNahla.png': 'Ustadha Nahla Rashid',
  'UstMariam.png': 'Ustadha Mariam',
  'UstAbubakr.png': 'Ustadh Abubakr',
  'Sheikh Abdinassir.png': 'Sheikh Abdinassir',
};

async function walkDirectory(directory: string): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const nestedPaths = await Promise.all(
    entries
      .filter((entry) => !entry.name.startsWith('.'))
      .map(async (entry) => {
        const absolutePath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
          return walkDirectory(absolutePath);
        }

        return [absolutePath];
      })
  );

  return nestedPaths.flat();
}

function humanizeText(value: string) {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getCategoryAndLabel(relativePath: string, fileName: string) {
  const parentDirectory = path.posix.dirname(relativePath);

  if (parentDirectory === '.') {
    if (FACULTY_LABELS[fileName]) {
      return {
        category: 'Faculty Portraits',
        label: FACULTY_LABELS[fileName],
      };
    }

    const baseName = path.basename(fileName, path.extname(fileName));

    return {
      category: 'General',
      label: humanizeText(baseName),
    };
  }

  const categoryFolder = path.posix.basename(parentDirectory);

  return {
    category: humanizeText(categoryFolder),
    label: humanizeText(categoryFolder),
  };
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const absolutePaths = await walkDirectory(PUBLIC_DIR);

  return absolutePaths
    .filter((absolutePath) => IMAGE_EXTENSIONS.has(path.extname(absolutePath).toLowerCase()))
    .map((absolutePath) => {
      const relativePath = path.relative(PUBLIC_DIR, absolutePath).replace(/\\/g, '/');
      const fileName = path.basename(relativePath);
      const { category, label } = getCategoryAndLabel(relativePath, fileName);

      return {
        src: `/${relativePath}`,
        alt: label,
        fileName,
        category,
        label,
      };
    })
    .sort((left, right) => {
      if (left.category === 'General' && right.category !== 'General') {
        return -1;
      }

      if (left.category !== 'General' && right.category === 'General') {
        return 1;
      }

      const categoryDelta = left.category.localeCompare(right.category, undefined, {
        numeric: true,
        sensitivity: 'base',
      });

      if (categoryDelta !== 0) {
        return categoryDelta;
      }

      return left.fileName.localeCompare(right.fileName, undefined, {
        numeric: true,
        sensitivity: 'base',
      });
    });
}
