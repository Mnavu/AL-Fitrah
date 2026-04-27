import fs from 'fs/promises';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);
const IGNORED_DIRECTORY_NAMES = new Set(['class materials and photos']);
const CATEGORY_BY_FOLDER: Record<string, string> = {
  'Baby Class Sessions': 'South C Campus',
  'Juniour Class Sessions': 'South C Campus',
  'Senior Class Sessions': 'South C Campus',
  'South C Campus': 'South C Campus',
  'Sisters Session': 'Sisters Classes',
  'Sisters Game Night': 'Sisters Classes',
  'Boys Boarding Campus': 'Boys Campus',
  'Al-Fitrah Graduation': 'Graduation',
};
const CATEGORY_ORDER = [
  'South C Campus',
  'Sisters Classes',
  'Boys Campus',
  'Graduation',
  'Faculty Portraits',
  'General',
] as const;
const CATEGORY_ORDER_INDEX = new Map<string, number>(
  CATEGORY_ORDER.map((category, index) => [category, index])
);

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
          if (IGNORED_DIRECTORY_NAMES.has(entry.name.toLowerCase())) {
            return [];
          }

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
  const groupedCategory = CATEGORY_BY_FOLDER[categoryFolder];

  return {
    category: groupedCategory ?? humanizeText(categoryFolder),
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
      const leftCategoryOrder = CATEGORY_ORDER_INDEX.get(left.category) ?? Number.MAX_SAFE_INTEGER;
      const rightCategoryOrder = CATEGORY_ORDER_INDEX.get(right.category) ?? Number.MAX_SAFE_INTEGER;

      if (leftCategoryOrder !== rightCategoryOrder) {
        return leftCategoryOrder - rightCategoryOrder;
      }

      const categoryDelta = left.category.localeCompare(right.category, undefined, {
        numeric: true,
        sensitivity: 'base',
      });

      if (categoryDelta !== 0) {
        return categoryDelta;
      }

      const labelDelta = left.label.localeCompare(right.label, undefined, {
        numeric: true,
        sensitivity: 'base',
      });

      if (labelDelta !== 0) {
        return labelDelta;
      }

      return left.fileName.localeCompare(right.fileName, undefined, {
        numeric: true,
        sensitivity: 'base',
      });
    });
}
