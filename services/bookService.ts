import { Book } from '../types';

const API_URL = `http://${window.location.hostname}:8000/api`;

const mapToBackend = (book: Partial<Book>) => {
    const mapping: Record<string, string> = {
        scientificReview: 'scientific_review',
        linguisticCorrector: 'linguistic_corrector',
        publicationYear: 'publication_year',
        customSize: 'custom_size',
        depositNumber: 'deposit_number',
        pageCount: 'page_count',
        adminNotes: 'admin_notes',
        publicVisible: 'public_visible',
        receivedFromResearchDate: 'received_from_research_date',
        titleApprovalDate: 'title_approval_date',
        depositRequestDate: 'deposit_request_date',
        depositReceiveDate: 'deposit_receive_date',
        orgWordReceiveDate: 'org_word_receive_date',
        abstractReceiveDate: 'abstract_receive_date',
        disbursementFormDate: 'disbursement_form_date',
        sentToDirectorDate: 'sent_to_director_date',
        receivedFromDirectorDate: 'received_from_director_date',
        sentToDesignerDate: 'sent_to_designer_date',
        receivedFromDesignerDate: 'received_from_designer_date',
        digitalPrintDate: 'digital_print_date',
        offsetPrintDate: 'offset_print_date',
        coverEndorsementDate: 'cover_endorsement_date',
        receiveFromPrintDate: 'receive_from_print_date',
        printingHouse: 'printing_house',
        printQuantity: 'print_quantity',
        coverEditableUrl: 'cover_editable_url',
        coverViewableUrl: 'cover_viewable_url',
        coverPrintableUrl: 'cover_printable_url',
        coverSignatureUrl: 'cover_signature_url',
        bodyEditableUrl: 'body_editable_url',
        bodyPdfUrl: 'body_pdf_url',
        bodyWatermarkUrl: 'body_watermark_url',
        bodySignaturesUrl: 'body_signatures_url',
    };

    const backendData: any = {};
    Object.entries(book).forEach(([key, value]) => {
        const backendKey = mapping[key] || key;
        // Convert empty strings to null for backend
        backendData[backendKey] = value === '' ? null : value;
    });
    return backendData;
};

const mapFromBackend = (data: any): Book => {
    const reverseMapping: Record<string, string> = {
        scientific_review: 'scientificReview',
        linguistic_corrector: 'linguisticCorrector',
        publication_year: 'publicationYear',
        custom_size: 'customSize',
        deposit_number: 'depositNumber',
        page_count: 'pageCount',
        admin_notes: 'adminNotes',
        public_visible: 'publicVisible',
        received_from_research_date: 'receivedFromResearchDate',
        title_approval_date: 'titleApprovalDate',
        deposit_request_date: 'depositRequestDate',
        deposit_receive_date: 'depositReceiveDate',
        org_word_receive_date: 'orgWordReceiveDate',
        abstract_receive_date: 'abstractReceiveDate',
        disbursement_form_date: 'disbursementFormDate',
        sent_to_director_date: 'sentToDirectorDate',
        received_from_director_date: 'receivedFromDirectorDate',
        sent_to_designer_date: 'sentToDesignerDate',
        received_from_designer_date: 'receivedFromDesignerDate',
        digital_print_date: 'digitalPrintDate',
        offset_print_date: 'offsetPrintDate',
        cover_endorsement_date: 'coverEndorsementDate',
        receive_from_print_date: 'receiveFromPrintDate',
        printing_house: 'printingHouse',
        print_quantity: 'printQuantity',
        cover_editable_url: 'coverEditableUrl',
        cover_viewable_url: 'coverViewableUrl',
        cover_printable_url: 'coverPrintableUrl',
        cover_signature_url: 'coverSignatureUrl',
        body_editable_url: 'bodyEditableUrl',
        body_pdf_url: 'bodyPdfUrl',
        body_watermark_url: 'bodyWatermarkUrl',
        body_signatures_url: 'bodySignaturesUrl',
    };

    const frontendData: any = { ...data };
    frontendData.id = data.id.toString();

    Object.entries(reverseMapping).forEach(([backendKey, frontendKey]) => {
        if (data[backendKey] !== undefined) {
            frontendData[frontendKey] = data[backendKey];
            delete frontendData[backendKey];
        }
    });

    return frontendData as Book;
};

export const bookService = {
    async getAll(): Promise<Book[]> {
        const response = await fetch(`${API_URL}/books`);
        if (!response.ok) throw new Error('Failed to fetch books');
        const data = await response.json();
        return data.map(mapFromBackend);
    },

    async create(book: Partial<Book>): Promise<Book> {
        const response = await fetch(`${API_URL}/books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mapToBackend(book)),
        });
        if (!response.ok) throw new Error('Failed to create book');
        const data = await response.json();
        return mapFromBackend(data);
    },

    async update(id: string, book: Partial<Book>): Promise<Book> {
        const response = await fetch(`${API_URL}/books/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mapToBackend(book)),
        });
        if (!response.ok) throw new Error('Failed to update book');
        const data = await response.json();
        return mapFromBackend(data);
    },

    async delete(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/books/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete book');
    },
};
