<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        Schema::create('Loans', function (Blueprint $table) {
            $table->id();
            $table->decimal('receivable',20,2);
            $table->integer('payment')->nullable();
            $table->string('date')->nullable();
            $table->string('loan_date')->nullable();
            $table->string('employee')->nullable();
            $table->string('company')->nullable();
            $table->integer('amortization')->nullable();
            $table->decimal('total',20,2);
            $table->decimal('total_loan_amount',20,2); // total loan amount with interest
            $table->string('end_of_term')->nullable();
            $table->integer('company_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //

        Schema::dropIfExists('Loans');
    }
};
