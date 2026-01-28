
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

  // Part 3: Production Tracking
  receivedFromResearchDate?: string;
  titleApprovalDate?: string;
  depositRequestDate?: string;
  depositReceiveDate?: string;
  orgWordReceiveDate?: string;
  abstractReceiveDate?: string;
  disbursementFormDate?: string;
  titleApprovalImage?: string;
  disbursementFormImage?: string;
  sentToDirectorDate?: string;
  receivedFromDirectorDate?: string;
  sentToDesignerDate?: string;
  receivedFromDesignerDate?: string;
  digitalPrintDate?: string;
  offsetPrintDate?: string;
  printingHouse?: string;
  printQuantity?: string;
  executor?: string;
  coverEndorsementDate?: string;
  receiveFromPrintDate?: string;

  // Files Status
  coverEditableUrl?: string;
  coverViewableUrl?: string;
  coverPrintableUrl?: string;
  coverSignatureUrl?: string;
  bodyEditableUrl?: string;
  bodyPdfUrl?: string;
  bodyWatermarkUrl?: string;
  bodySignaturesUrl?: string;
  adminNotes?: string;
  publicVisible?: boolean;
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN'
}

export interface AdminPermissions {
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canHide: boolean;
}

export interface User {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
  permissions: AdminPermissions;
}
