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

class DataController extends Controller
{
    public function company()
    {
        
        $userRoles = auth()->user()->roles->pluck('name')->toArray();

        if (in_array('owner', $userRoles) || in_array('admin', $userRoles)) {
            $companies = DB::table('companies')->get();
        } else {
            $companyId = auth()->user()->company_id;
            $companies = DB::table('companies')->where('id', $companyId)->get();
        }
    
        return response()->json($companies);
    }



    //create Company // needs model
    public function store(Request $request)
    {

        $companyData = $request->validate([
            'company_name' => 'required|string',
            'capital' => 'required'
        ]);

        $capital = str_replace(',', '', $companyData['capital']);

        $company = new Company();
        $company->name = $companyData['company_name'];
        $company->capital = $capital;

        $company->save();


    }

    public function updateCompany(Request $request, $id)
    {
        // Validate the incoming data
        $companyData = $request->validate([
            'company_name' => 'required|string',
            'capital' => 'required'
        ]);

        // Find the company by ID
        $company = Company::find($id);
        $capitals = str_replace(',', '', $companyData['capital']);
        $capitals = floatval($capitals);
        // Check if the company exists
        if ($company) {
            // Update company data
            $company->name = $companyData['company_name']; // Update company name
            $company->capital = $capitals; // Update capital

            // Save the updated company data
            $company->save();

            // Return a success response if needed
            return response()->json(['message' => 'Company updated successfully'], 200);
        } else {
            // If company not found, return an error response
            return response()->json(['error' => 'Company not found'], 404);
        }
    }

    public function edit($id)
    {   

        $userRoles = auth()->user()->roles->pluck('name')->toArray();
        $company = Company::find($id);
        if (in_array('owner', $userRoles) || in_array('admin', $userRoles)) {
            return response()->json($company->toArray());
        } else {
            return response()->json(['error' => 'You dont Have The Permission to Edit a Company'], 404);
        }
    
    }



    //employee
    public function employee()
    {
        $employees = DB::table('employees')
            ->join('companies', 'employees.company_id', '=', 'companies.id')
            ->select(
                'employees.*', // Select all columns from employees table
                'companies.name as company_name' // Alias the company name column
            )
            ->get();

        return response()->json($employees);
    }

    public function employeeById(Request $request, $companyId)
    {
        // Use $companyId obtained from the URL parameter

        $employees = DB::table('employees')
            ->join('companies', 'employees.company_id', '=', 'companies.id')
            ->where('employees.company_id', '=', $companyId)
            ->select(
                'employees.*', // Select all columns from employees table
                'companies.name as company_name' // Alias the company name column
            )
            ->get();

        return response()->json($employees);
    }


    public function createEmployee(Request $request)
    {
        $employeeData = $request->validate([
            'company_id' => 'required|string',
            'name' => 'required|string',
            'email' => 'required|string|email',
            'status' => 'required',
        ]);

        // Create a new Employee instance and fill it with the validated data
        $employee = new Employee();
        $employee->name = $employeeData['name'];
        $employee->email = $employeeData['email'];
        $employee->status = $employeeData['status'];
        $employee->company_id = $employeeData['company_id']; // Assign company_id directly


        $employee->save();
        return response()->json(['message' => 'Employee created successfully'], 201);


    }


    //Amortization table
    public function amortizations()
    {
        $userRoles = auth()->user()->roles->pluck('name')->toArray();
        
        if (in_array('owner', $userRoles)) {
            $amortizations = DB::table('amortizations')
                ->join('companies', 'amortizations.company_id', '=', 'companies.id')
                ->select('amortizations.*', 'companies.name as company_name')
                ->get();
        } else {
            $user = auth()->user();
            $companyId = $user->company_id;
            
            if (in_array('admin', $userRoles) || in_array('payroll_officer', $userRoles)) {
                $amortizations = DB::table('amortizations')
                    ->join('companies', 'amortizations.company_id', '=', 'companies.id')
                    ->select('amortizations.*', 'companies.name as company_name')
                    ->where('amortizations.company_id', $companyId)
                    ->get();
            } else {
                $amortizations = DB::table('amortizations')
                    ->join('companies', 'amortizations.company_id', '=', 'companies.id')
                    ->select('amortizations.*', 'companies.name as company_name')
                    ->where('amortizations.company_id', $companyId)
                    ->where('amortizations.status', 'ongoing')
                    ->get();
            }
        }
    
        return response()->json($amortizations);
    }
    
    
    public function pending_loans(Request $request)
    {
        $user = $request->user();
        $userRoles = $user->roles->pluck('name')->toArray();
        
        if (in_array('owner', $userRoles)) {
            // For owner, return all pending loans
            $loans = PendingLoan::join('companies', 'pending_loans.company_id', '=', 'companies.id')
                ->select('pending_loans.*', 'companies.name as company_name')
                ->get();
        } elseif (in_array('admin', $userRoles) || in_array('payroll_officer', $userRoles)) {
            // For admin or payroll officer, return pending loans of employees in the same company
            $companyId = $user->company_id;
            $loans = PendingLoan::join('companies', 'pending_loans.company_id', '=', 'companies.id')
                ->select('pending_loans.*', 'companies.name as company_name')
                ->where('companies.id', $companyId) 
                ->get();
        } else {
            $employeeId = $user->id;
            $loans = PendingLoan::join('companies', 'pending_loans.company_id', '=', 'companies.id')
                ->select('pending_loans.*', 'companies.name as company_name')
                ->where('pending_loans.employee_id', $employeeId)
                ->get();
        }
        
        return response()->json($loans);
    }
    
    
    
}
    
