<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Company;
use App\Models\Employee;
use App\Models\Loan;
use App\Models\Amortization;
use App\Models\PendingLoan;
use DateTime;

class LoanController extends Controller
{


    public function loans(Request $request)
    {
        $user = $request->user(); 
        $userRoles = $user->roles->pluck('name')->toArray();
    
        if (in_array('owner', $userRoles) || in_array('admin', $userRoles)) {
            $loans = DB::table('loans')->get();
        } elseif (in_array('payroll_officer', $userRoles)) {
            $companyId = $user->company_id;
            $loans = DB::table('loans')->where('company_id', $companyId)->get();
        } else {
            return response()->json(['error' => 'Unauthorized access'], 403);
        }
    
        return response()->json($loans);
    }
    
    public function createLoan(Request $request)
    {
        $validatedData = $request->validate([
            'loan_amount' => 'required',
            'term' => 'required|numeric',
            'employee' => 'required',
            "company" => "required",
            "company_id" => "required|numeric",
        ]);

        $loanAmount = str_replace(',', '', $validatedData['loan_amount']);
        $term = $validatedData['term'];
        $interestRate = 0.05 * $term; // 5% interest rate per month

        // Calculate interest   
        $interest = $loanAmount * $interestRate;

        // Calculate total loan amount
        $totalLoanAmount = $loanAmount + $interest;

        // Calculate monthly payment
        $monthlyPayment = $totalLoanAmount / $term;

        // Create a new Loan instance and assign values
        $loan = new Amortization();
        $loan->amount = $monthlyPayment;
        $loan->date = date('Y-m-d H:i:s'); // date approaved
        $loan->save();
        $paymentId = $loan->id;


        $company = Company::findOrFail($validatedData['company_id']);
        $currentCapital = $company->capital;
        $currentCapital = str_replace(',', '', $currentCapital);

        // Check if the loan amount exceeds the current capital
        if ($totalLoanAmount > $currentCapital) {
            // Return an error response indicating that the loan amount exceeds the current capital
            return response()->json(['error' => 'Loan amount exceeds the current capital of the company'], 400);
        }

        // Deduct the loan amount from the company's capital
        $company->capital -= $totalLoanAmount;
        $company->save();

        $currentDate = date('F j, Y');
        for ($i = 1; $i <= $term; $i++) {
            $display_loan = new Loan();
            $display_loan->receivable = $monthlyPayment;
            $display_loan->payment = $paymentId;
            $display_loan->date = null;
            $display_loan->loan_date = $currentDate;
            $display_loan->employee = $validatedData['employee'];
            $display_loan->company = $validatedData['company'];
            $display_loan->company_id = $validatedData['company_id'];
            $display_loan->amortization = $term;
            $display_loan->total = $loanAmount;
            $display_loan->total_loan_amount = $totalLoanAmount;
            $display_loan->end_of_term = null; // *3 mo yung date
            $display_loan->save();
        }
    }


    public function deduct(Request $request)
    {
        $validatedData = $request->validate([
            'loan_amount' => 'required|numeric',
            "company_id" => "required|numeric",
        ]);

        $totalLoanAmount = $validatedData["loan_amount"];
        //amount check capital company
        $currentCapital = Company::findOrFail($validatedData['company_id'])->capital;

        // Check if the loan amount exceeds the current capital
        if ($totalLoanAmount > $currentCapital) {
            // Return an error response indicating that the loan amount exceeds the current capital
            return response()->json(['error' => 'Loan amount exceeds the current capital of the company'], 400);
        }



    }
    public function approvedLoan(Request $request, $id)
    {

        // Validate the incoming request
        $request->validate([
            'status' => 'required|in:pending,approved,completed',
        ]);

        $loan = Loan::findOrFail($id);
        $amortization = $loan->amortization;

        $loan->status = $request->input('status');
        $currentDate = date('F j, Y');
        $loan->date = $currentDate;

        $loanStartDate = new DateTime($loan->date);
        $endOfTerm = clone $loanStartDate;
        $endOfTerm->modify("+$amortization months");

        // Set the end of term for the loan
        $loan->end_of_term = date('F j, Y', strtotime($endOfTerm->format('Y-m-d')));
        $loan->save();


    }

    public function filterLoansByCompanyId(Request $request, $company_id)
    {

        $loans = DB::table('loans')
            ->join('companies', 'loans.company_id', '=', 'companies.id')
            ->where('loans.company_id', '=', $company_id) // Filter loans by company_id
            ->select(
                'loans.*',
                'companies.name as company_name'
            )
            ->get();

        return response()->json($loans);
    }



    public function requestLoan(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'loan_amount' => 'required',
            'term' => 'required',
        ]);

        $loanAmount = str_replace(',', '', $request->loan_amount);

        // Fetch the current capital of the company
        $company = Company::find($user->company_id);
        $currentCapital = str_replace(',', '', $company->capital);

        // Check if the loan amount is greater than the current capital of the company
        if ($loanAmount > $currentCapital) {
            // Return a response indicating insufficient capital
            return response()->json(['error' => 'Insufficient capital in the company'], 400);
        }

        // Proceed with creating the pending loan request
        $loan = new PendingLoan();
        $loan->employee_id = $user->id;
        $loan->amount = $loanAmount;
        $loan->term = $request->term;
        $loan->status = "pending";
        $loan->name = $user->name;
        $loan->company_id = $user->company_id;
        $loan->save();

        // Return a response indicating success
        return response()->json(['message' => 'Loan request created successfully'], 201);
    }


    public function createLoanForEmployee(Request $request)
    {
        $validatedData = $request->validate([
            'loan_amount' => 'required',
            'term' => 'required|numeric',
            'employee' => 'required',
            "company" => "required",
            "company_id" => "required|numeric",
            "employee_id" => 'required|numeric',
        ]);

        $user = User::findOrFail($validatedData['employee_id']);
        $loanAmount = str_replace(',', '', $request->loan_amount);

        // Retrieve company's capital
        $company = Company::findOrFail($validatedData['company_id']);
        $companyCapital = $company->capital;

        // Check if the requested loan amount exceeds the company's capital
        if ($loanAmount > $companyCapital) {
            return response()->json(['error' => 'Loan amount exceeds company\'s capital'], 400);
        }

        $loan = new PendingLoan();
        $loan->employee_id = $user->id;
        $loan->amount = $loanAmount;
        $loan->term = $request->term;
        $loan->status = "pending";
        $loan->name = $user->name;
        $loan->company_id = $user->company_id;
        $loan->save();

        // Return a response indicating success
        return response()->json(['message' => 'Loan request created successfully'], 201);
    }

    public function aproveRequest(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,completed',
        ]);
        $pendingLoan = PendingLoan::findOrFail($id);
        $pendingLoan->status = $request->input('status');
        $pendingLoan->save();
        return response()->json(['message' => 'Pending loan status updated successfully', 'pending_loan' => $pendingLoan]);
    }

    public function addLoan(Request $request)
    {

        $validatedData = $request->validate([
            'pending_loans' => 'required|array', // Ensure it's an array
            'pending_loans.*.id' => 'required|integer', // Validate the id of each loan
            'pending_loans.*.amount' => 'required|numeric|min:0', // Validate the amount field as required, numeric, and minimum value of 0
            'pending_loans.*.term' => 'required|integer|min:1', // Validate the term field as required, integer, and minimum value of 1
            'pending_loans.*.status' => 'required|in:pending,approved,completed',
            'pending_loans.*.company_id' => 'required|integer',
            'pending_loans.*.employee_id' => 'required|integer',

        ]);


        $updatedRow = $request->input('pending_loans')[0];
        // You can access specific fields like $updatedRow['id'], $updatedRow['status'], etc.


        $loanAmount = str_replace(',', '', $updatedRow['amount']);// Total of Amort
        $term = $updatedRow['term'];
        $interestRate = 0.05 * $term; // 5% interest rate per month

        // Calculate interest   
        $interest = $loanAmount * $interestRate;
        // Calculate total loan amount
        $totalLoanAmount = $loanAmount + $interest;
        // Calculate monthly payment
        $monthlyPayment = $totalLoanAmount / $term;


        for ($i = 1; $i <= $term; $i++) {
            $loan = new Amortization();
            $loan->amount = $monthlyPayment;
            $nextMonth = date('Y-m-d', strtotime('first day of +' . $i . ' month'));
            $loan->date = date('F j, Y', strtotime($nextMonth));

            $loan->company_id = $updatedRow['company_id'];
            $loan->term = $updatedRow['term'];
            $loan->save();
        }



        $paymentId = $loan->payment;

        $company = Company::findOrFail($updatedRow['company_id']);
        $currentCapital = $company->capital;
        $companyName = $company->name;
        $currentCapital = str_replace(',', '', $currentCapital);

        $user = User::findOrFail($updatedRow['employee_id']);
        $userName = $user->name;


        $company->capital -= $loanAmount; //minus no interest
        $company->save();


        $currentDate = date('F j, Y');
        $loan->date = $currentDate;
        $amortization = $updatedRow['term'];
        $loanStartDate = new DateTime($loan->date);
        $endOfTerm = clone $loanStartDate;
        $endOfTerm->modify("+$amortization months");

        $today = new DateTime();
        $nextMonth = $today->modify('first day of next month');


        for ($i = 1; $i <= $term; $i++) {
            $display_loan = new Loan();
            $display_loan->receivable = $monthlyPayment;
            $display_loan->payment = $paymentId;

            $loanAmortDate = date('Y-m-d', strtotime('first day of +' . $i . ' month'));
            $display_loan->date = date('F j, Y', strtotime($loanAmortDate));
            //$display_loan->date = $nextMonth->format('F j, Y');
            $display_loan->loan_date = $currentDate;
            $display_loan->employee = $userName;
            $display_loan->company = $companyName;
            $display_loan->company_id = $updatedRow['company_id'];
            $display_loan->amortization = $term;
            $display_loan->total = $loanAmount;
            $display_loan->total_loan_amount = $totalLoanAmount;
            $display_loan->end_of_term = $endOfTerm->format('F j, Y');
            $display_loan->save();
        }

    }


    public function loanPayment(Request $request, $payment)
    {
        $companyId = $request->input('company_id');
        $company = Company::findOrFail($companyId);
        $paymentAmount = $request->input('amount');

        $loan = Amortization::findOrFail($payment);
        $term = $loan->term;

        $loan->status = 'completed';
        $totalPayment = $paymentAmount;

        $company->capital = $company->capital + $totalPayment;

        $company->save();
        $loan->save();

        return response()->json(['message' => 'Payment added successfully'], 200);
    }


}
