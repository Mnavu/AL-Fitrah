export const STATIC_ASSETS = {
  logo: '/Class materials and Photos/Logo.png',
  logoAlt: '/Class materials and Photos/Logo1.png',
  sistersSessionMain: '/Sisters Session/Ladies.jpg',
  sistersSessionAlt: '/Sisters Session/Sisters.jpeg',
  juniorClassHero: '/Juniour Class Sessions/Al-Fitrah1.png',
  juniorClassSession: '/Juniour Class Sessions/Al-Fitrah2.png',
  seniorClassSession: '/Senior Class Sessions/Al-Fitrah3.jpeg',
  babyClassSession: '/Baby Class Sessions/Babyclass.png',
  consultation: '/Class materials and Photos/Consultation.png',
  hadithNawawi: '/Class materials and Photos/Hadith-An-Nawawi.png',
  ladiesWorkbook: '/Class materials and Photos/Ladies.png',
  backToBasics: '/Class materials and Photos/Back-to-Basics.jpeg',
  islamicStudiesKindergarten: '/Class materials and Photos/Islamic-Studies-Kindergaten.jpeg',
  juniorHadith: '/Class materials and Photos/Junior-Hadith.png',
  marriage: '/Class materials and Photos/Marriage.png',
  nooraniyah: '/Class materials and Photos/Nooraniyah.jpeg',
  boysBoarding17: '/Boys Boarding Campus/17.jpeg',
  boysBoarding21: '/Boys Boarding Campus/21.jpeg',
  boysBoarding27: '/Boys Boarding Campus/27.jpeg',
  boysBoardingDSC09472: '/Boys Boarding Campus/DSC09472.jpg',
  boysBoardingDSC09475: '/Boys Boarding Campus/DSC09475.jpg',
  boysBoardingDSC09478: '/Boys Boarding Campus/DSC09478.jpg',
  boysBoardingDSC09511: '/Boys Boarding Campus/DSC09511.jpg',
  boysBoardingDSC09524: '/Boys Boarding Campus/DSC09524.jpg',
  boysBoardingDSC09571: '/Boys Boarding Campus/DSC09571.jpg',
  onlineProgram: '/Online.png',
  facultyAmina: '/UstAmina.jpg',
  facultyNasser: '/UstNasser.jpeg',
  facultyMusa: '/UstMusa.jpeg',
  facultyNahla: '/UstNahla.png',
  facultyMariam: '/UstMariam.png',
  facultyAbubakr: '/UstAbubakr.png',
  sheikhAbdinassir: '/Sheikh Abdinassir.png',
  boysBoardingTimetable: '/Timetables/5.png',
} as const;

const LEGACY_PATH_MAP: Record<string, string> = {
  '/Logo.png': STATIC_ASSETS.logo,
  '/Logo1.png': STATIC_ASSETS.logoAlt,
  '/Ladies.jpg': STATIC_ASSETS.sistersSessionMain,
  '/Sisters.jpeg': STATIC_ASSETS.sistersSessionAlt,
  '/Al-Fitrah1.png': STATIC_ASSETS.juniorClassHero,
  '/Al-Fitrah2.png': STATIC_ASSETS.juniorClassSession,
  '/Al-Fitrah3.jpeg': STATIC_ASSETS.seniorClassSession,
  '/Babyclass.png': STATIC_ASSETS.babyClassSession,
  '/Consultation.png': STATIC_ASSETS.consultation,
  '/Hadith-An-Nawawi.png': STATIC_ASSETS.hadithNawawi,
  '/Ladies.png': STATIC_ASSETS.ladiesWorkbook,
  '/Back-to-Basics.jpeg': STATIC_ASSETS.backToBasics,
  '/Islamic-Studies-Kindergaten.jpeg': STATIC_ASSETS.islamicStudiesKindergarten,
  '/Junior-Hadith.png': STATIC_ASSETS.juniorHadith,
  '/Marriage.png': STATIC_ASSETS.marriage,
  '/Nooraniyah.jpeg': STATIC_ASSETS.nooraniyah,
  '/17.jpeg': STATIC_ASSETS.boysBoarding17,
  '/21.jpeg': STATIC_ASSETS.boysBoarding21,
  '/27.jpeg': STATIC_ASSETS.boysBoarding27,
  '/1.jpg': '/Al-Fitrah Graduation/1.jpg',
  '/2.jpg': '/Juniour Class Sessions/2.jpg',
  '/3.jpg': '/Al-Fitrah Graduation/3.jpg',
  '/4.jpg': '/Al-Fitrah Graduation/4.jpg',
  '/5.jpg': '/Al-Fitrah Graduation/5.jpg',
  '/6.jpg': '/Al-Fitrah Graduation/6.jpg',
  '/7.jpg': '/Al-Fitrah Graduation/7.jpg',
  '/8.jpg': '/Al-Fitrah Graduation/8.jpg',
  '/9.jpg': '/Al-Fitrah Graduation/9.jpg',
  '/10.jpg': '/Al-Fitrah Graduation/10.jpg',
  '/11.jpg': '/Al-Fitrah Graduation/11.jpg',
  '/12.jpg': '/Al-Fitrah Graduation/12.jpg',
  '/13.jpg': '/Al-Fitrah Graduation/13.jpg',
  '/14.jpg': '/Al-Fitrah Graduation/14.jpg',
  '/15.jpg': '/Al-Fitrah Graduation/15.jpg',
};

export function resolveLegacyImagePath(imagePath?: string | null) {
  if (!imagePath) {
    return imagePath ?? '';
  }

  return LEGACY_PATH_MAP[imagePath] ?? imagePath;
}

export function getGraduationGalleryPath(imageNumber: number) {
  return resolveLegacyImagePath(`/${imageNumber}.jpg`);
}
