<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('pending_loans', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id');
            $table->unsignedBigInteger('company_id');
            $table->decimal('amount', 10, 2);
            $table->integer('term');
            $table->string('status')->default('pending');
            $table->timestamps();
            $table->string('name');
            $table->foreign('employee_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('company_id')->references('id')->on('users')->onDelete('cascade');
            // Assuming 'employees' is the table name for employees. Adjust as needed.
        });
    }

    public function down()
    {
        Schema::dropIfExists('pending_loans');
    }
};
