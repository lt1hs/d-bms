<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $fillable = [
        'category',
        'title',
        'author',
        'scientific_review',
        'translation',
        'linguistic_corrector',
        'investigation',
        'director',
        'cover_designer',
        'publication_year',
        'edition',
        'type',
        'size',
        'custom_size',
        'status',
        'image',
        'deposit_number',
        'isbn',
        'page_count',
        'public_visible',
        'admin_notes',
        'received_from_research_date',
        'title_approval_date',
        'deposit_request_date',
        'deposit_receive_date',
        'org_word_receive_date',
        'abstract_receive_date',
        'disbursement_form_date',
        'sent_to_director_date',
        'received_from_director_date',
        'sent_to_designer_date',
        'received_from_designer_date',
        'digital_print_date',
        'offset_print_date',
        'cover_endorsement_date',
        'receive_from_print_date',
        'printing_house',
        'print_quantity',
        'executor',
        'cover_editable_url',
        'cover_viewable_url',
        'cover_printable_url',
        'cover_signature_url',
        'body_editable_url',
        'body_pdf_url',
        'body_watermark_url',
        'body_signatures_url',
    ];
}
