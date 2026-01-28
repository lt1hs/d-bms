<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('category')->nullable();
            $table->string('title');
            $table->string('author');
            $table->string('scientific_review')->nullable();
            $table->string('translation')->nullable();
            $table->string('linguistic_corrector')->nullable();
            $table->string('investigation')->nullable();
            $table->string('director')->nullable();
            $table->string('cover_designer')->nullable();
            $table->string('publication_year')->nullable();
            $table->string('edition')->nullable();
            $table->string('type')->nullable();
            $table->string('size')->nullable();
            $table->string('custom_size')->nullable();
            $table->string('status')->nullable();
            $table->longText('image')->nullable();
            $table->string('deposit_number')->nullable();
            $table->string('isbn')->unique()->nullable();
            $table->integer('page_count')->nullable();
            $table->boolean('public_visible')->default(true);
            $table->text('admin_notes')->nullable();

            // Production tracking dates
            $table->date('received_from_research_date')->nullable();
            $table->date('title_approval_date')->nullable();
            $table->date('deposit_request_date')->nullable();
            $table->date('deposit_receive_date')->nullable();
            $table->date('org_word_receive_date')->nullable();
            $table->date('abstract_receive_date')->nullable();
            $table->date('disbursement_form_date')->nullable();
            $table->date('sent_to_director_date')->nullable();
            $table->date('received_from_director_date')->nullable();
            $table->date('sent_to_designer_date')->nullable();
            $table->date('received_from_designer_date')->nullable();
            $table->date('digital_print_date')->nullable();
            $table->date('offset_print_date')->nullable();
            $table->date('cover_endorsement_date')->nullable();
            $table->date('receive_from_print_date')->nullable();

            $table->string('printing_house')->nullable();
            $table->string('print_quantity')->nullable();
            $table->string('executor')->nullable();

            // File URLs
            $table->string('cover_editable_url')->nullable();
            $table->string('cover_viewable_url')->nullable();
            $table->string('cover_printable_url')->nullable();
            $table->string('cover_signature_url')->nullable();
            $table->string('body_editable_url')->nullable();
            $table->string('body_pdf_url')->nullable();
            $table->string('body_watermark_url')->nullable();
            $table->string('body_signatures_url')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
