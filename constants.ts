
import { Category, PublicationType, PublicationSize, ProcessStatus } from './types';

export const CATEGORIES = Object.values(Category);
export const PUBLICATION_TYPES = Object.values(PublicationType);
export const PUBLICATION_SIZES = Object.values(PublicationSize);
export const PROCESS_STATUSES = Object.values(ProcessStatus);

export const STATUS_COLORS: Record<ProcessStatus, string> = {
  [ProcessStatus.Stopped]: 'bg-red-100 text-red-800 border-red-200',
  [ProcessStatus.InProgress]: 'bg-blue-100 text-blue-800 border-blue-200',
  [ProcessStatus.Printed]: 'bg-green-100 text-green-800 border-green-200',
  [ProcessStatus.InPrinting]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
};

export const INITIAL_BOOK_DATA = {
  title: '',
  author: '',
  scientificReview: '',
  translation: '',
  linguisticCorrector: '',
  investigation: '',
  director: '',
  coverDesigner: '',
  publicationYear: new Date().getFullYear().toString(),
  edition: 'الأولى',
  type: PublicationType.Book,
  size: PublicationSize.Waziri,
  customSize: '',
  status: ProcessStatus.InProgress,
  image: '/images/placeholder.jpg',
  depositNumber: '',
  isbn: '',
  pageCount: 0,
};
