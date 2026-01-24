
export enum Category {
  Books = 'الكتب',
  Booklets = 'الكتيبات',
  GuideMagazine = 'مجلة الدليل',
  AnnualReport = 'التقرير السنوي',
  VisualReport = 'التقرير المصور لنشاطات المؤسسة',
  NatureMagazine = 'مجلة الطبيعة'
}

export enum PublicationType {
  Book = 'كتاب',
  Booklet = 'كتيب',
  Pamphlet = 'كراس',
  GuideMagazine = 'مجلة الدليل',
  NatureMagazine = 'مجلة الطبيعة',
  VisualReport = 'تقرير مصور'
}

export enum PublicationSize {
  Waziri = 'وزيري',
  Rahli = 'رحلي',
  Ruqi = 'رقعي',
  Custom = 'قطع خاص'
}

export enum ProcessStatus {
  Stopped = 'متوقف',
  InProgress = 'قيد العمل',
  Printed = 'مطبوع',
  InPrinting = 'قيد الطباعة'
}

export interface Book {
  id: string;
  category: Category;
  
  // Part 1: Primary Data
  title: string;
  author: string;
  scientificReview: string;
  translation: string;
  linguisticCorrector: string;
  investigation: string;
  director: string;
  coverDesigner: string;
  publicationYear: string;
  edition: string;

  // Part 2: Technical Data
  type: PublicationType;
  size: PublicationSize;
  customSize: string;
  status: ProcessStatus;
  image: string;
  depositNumber: string;
  isbn: string;
  pageCount: number;
}
