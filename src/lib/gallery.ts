import fs from 'fs/promises';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);

const TITLE_OVERRIDES: Record<string, string> = {
  '1': 'Sisters Eid Gala Moment 1',
  '2': 'Sisters Eid Gala Moment 2',
  '3': 'Sisters Eid Gala Moment 3',
  '4': 'Sisters Eid Gala Moment 4',
  '5': 'Sisters Eid Gala Moment 5',
  '6': 'Sisters Eid Gala Moment 6',
  '7': 'Sisters Eid Gala Moment 7',
  '8': 'Sisters Eid Gala Moment 8',
  '9': 'Sisters Eid Gala Moment 9',
  '10': 'Sisters Eid Gala Moment 10',
  '11': 'Sisters Eid Gala Moment 11',
  '12': 'Sisters Eid Gala Moment 12',
  '13': 'Sisters Eid Gala Moment 13',
  '14': 'Sisters Eid Gala Moment 14',
  '15': 'Sisters Eid Gala Moment 15',
  '16': 'Sisters Eid Gala Moment 16',
  '17': 'Boys Boarding Campus Highlight',
  '21': 'Campus Gathering',
  '27': 'Boarding Campus Highlight',
  'Al-Fitrah1': 'South C Campus',
  'Al-Fitrah2': 'Campus Session',
  'Al-Fitrah3': 'Community Engagement',
  Amma: 'Amma Learning Material',
  Babyclass: 'Baby Class Session',
  'Back-to-Basics': 'Back To Basics Material',
  Consultation: 'Counselling And Support',
  'Hadith-An-Nawawi': 'Hadith An-Nawawi Material',
  'Islamic-Studies-Kindergaten': 'Islamic Studies Kindergarten Material',
  'Junior-Hadith': 'Junior Hadith Material',
  Ladies: 'Sisters Eid Gala',
  Logo: 'Al-Fitrah Institute Logo',
  Logo1: 'Al-Fitrah Logo Variation',
  Marriage: 'Marriage Program',
  Nooraniyah: 'Nooraniyah Material',
  Online: 'Online Program',
  'Sheikh Abdinassir': 'Sheikh Abdinassir',
  Sisters: 'Sisters Program',
  Tabarak: 'Tabarak Learning Material',
  UstAbubakr: 'Ustadh Abubakr',
  UstAmina: 'Ustadha Amina Abdiqadir',
  UstMariam: 'Ustadha Mariam',
  UstMusa: 'Ustadh Musa Anis',
  UstNahla: 'Ustadha Nahla Rashid',
  UstNasser: 'Ustadh Nasser Abdulaziz',
};

const ORIGIN_ORDER: Record<string, number> = {
  'Sisters Eid Gala': 1,
  'Graduation senior class': 2,
  'Junior class': 3,
  'Boys boarding campus': 4,
  'Campus life': 5,
  'Faculty portraits': 6,
  'Learning materials': 7,
  'Adult and counselling classes': 8,
  'Institute branding': 9,
  'Community moments': 10,
};

export type GalleryItem = {
  src: string;
  alt: string;
  title: string;
  origin: string;
  fileName: string;
  featured: boolean;
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

function humanizeFileName(fileName: string) {
  return fileName
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function inferOrigin(relativePath: string, baseName: string) {
  const fullName = `${relativePath} ${baseName}`.toLowerCase();

  if (fullName.includes('logo')) {
    return 'Institute branding';
  }

  if (/(graduation|graduate|senior)/.test(fullName)) {
    return 'Graduation senior class';
  }

  if (/(sisters|ladies|eid|gala)/.test(fullName)) {
    return 'Sisters Eid Gala';
  }

  if (/^\d+$/.test(baseName)) {
    const number = Number(baseName);

    if (number >= 1 && number <= 16) {
      return 'Sisters Eid Gala';
    }

    if ([17, 21, 27].includes(number)) {
      return 'Boys boarding campus';
    }
  }

  if (/(junior|babyclass|amma|tabarak|nooraniyah|kindergaten)/.test(fullName)) {
    return 'Junior class';
  }

  if (/(ust|sheikh)/.test(fullName)) {
    return 'Faculty portraits';
  }

  if (/(hadith|basics|material|book)/.test(fullName)) {
    return 'Learning materials';
  }

  if (/(consultation|marriage|online|support|counselling)/.test(fullName)) {
    return 'Adult and counselling classes';
  }

  if (/(boarding|campus|al-fitrah)/.test(fullName)) {
    return 'Campus life';
  }

  return 'Community moments';
}

function isFeatured(baseName: string, origin: string) {
  const featuredNames = new Set([
    '21',
    '27',
    'Ladies',
    'UstAmina',
    'Al-Fitrah1',
    'Babyclass',
    'Marriage',
    'Sisters',
  ]);

  if (featuredNames.has(baseName)) {
    return true;
  }

  return origin === 'Graduation senior class';
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const absolutePaths = await walkDirectory(PUBLIC_DIR);

  const items = absolutePaths
    .filter((absolutePath) => IMAGE_EXTENSIONS.has(path.extname(absolutePath).toLowerCase()))
    .map((absolutePath) => {
      const relativePath = path.relative(PUBLIC_DIR, absolutePath).replace(/\\/g, '/');
      const fileName = path.basename(relativePath);
      const baseName = path.basename(fileName, path.extname(fileName));
      const title = TITLE_OVERRIDES[baseName] ?? humanizeFileName(baseName);
      const origin = inferOrigin(relativePath, baseName);

      return {
        src: `/${relativePath}`,
        alt: `${title} - ${origin}`,
        title,
        origin,
        fileName,
        featured: isFeatured(baseName, origin),
      };
    })
    .sort((left, right) => {
      const originDelta = (ORIGIN_ORDER[left.origin] ?? 999) - (ORIGIN_ORDER[right.origin] ?? 999);

      if (originDelta !== 0) {
        return originDelta;
      }

      return left.fileName.localeCompare(right.fileName, undefined, {
        numeric: true,
        sensitivity: 'base',
      });
    });

  return items;
}
