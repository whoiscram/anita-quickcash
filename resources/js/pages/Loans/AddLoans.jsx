import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, InputLabel } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CurrencyTextField from "@lupus-ai/mui-currency-textfield";

export default function AddCompany() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        loan_amount: "",
        term: "",
        employee: "",
        company: "",
    });

    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState("");
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState("");

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = {
                    'Authorization': `Bearer ${token}`
                };
    
                const response = await axios.post("/company", {}, { headers: headers });
                setCompanies(response.data);
            } catch (error) {
                console.error("Error fetching companies:", error);
            }
        };
    
        fetchCompanies();
    }, []);
    

    const handleCompanyChange = async (e) => {
        const companyId = e.target.value;
        setSelectedCompany(companyId);
        setFormData({ ...formData, company: companyId });
    
        try {
            const token = localStorage.getItem('token');
    
            const headers = {
                'Authorization': `Bearer ${token}`
            };
    
            const response = await axios.post(`/filterUser/${companyId}`, {}, { headers: headers });
            setEmployees(response.data || []); // Ensure that response.data is not undefined before setting state
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    
        // Reset selected employee when company changes
        setSelectedEmployee("");
    };
    

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleClick = () => {
        navigate("/dashboard/loans");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const selectedCompanyObj = companies.find(
                (company) => company.id === selectedCompany
            );
    
            const selectedEmployeeObj = employees.find(
                (employee) => employee.id === selectedEmployee
            );
    
            const formDataWithCompanyAndEmployee = {
                ...formData,
                company: selectedCompanyObj ? selectedCompanyObj.name : "",
                employee: selectedEmployeeObj ? selectedEmployeeObj.name : "",
                company_id: selectedCompany,
                employee_id: selectedEmployee, // Add the selected employee ID
            };
    
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "/loans/createLoanForEmployee",
                formDataWithCompanyAndEmployee, // Include employee_id in the request payload
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            navigate("/dashboard/loans");
        } catch (error) {
            window.alert(
                "Loan amount exceeds the current capital of the company"
            );
            console.error("Error submitting form data:", error);
        }
    };
    
    return (
        <Layout>
            <Button variant="contained" onClick={handleClick}>
                BACK
            </Button>
            <Card>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <CurrencyTextField
                                        id="loan_amount"
                                        label="Loan Amount"
                                        outputFormat="number"
                                        currencySymbol="₱"
                                        value={formData.loan_amount}
                                        onChange={handleChange}
                                    />
                                </FormControl>
                                <FormControl fullWidth>
                                    <TextField
                                        label="term"
                                        id="term"
                                        type="number"
                                        value={formData.term}
                                        onChange={handleChange}
                                    />
                                </FormControl>

                                <FormControl fullWidth>
                                    <InputLabel>Company</InputLabel>
                                    <Select
                                        id="company"
                                        type="text"
                                        value={selectedCompany}
                                        onChange={handleCompanyChange}
                                    >
                                        <MenuItem value="">
                                            Select Company
                                        </MenuItem>
                                        {companies.map((company) => (
                                            <MenuItem
                                                key={company.id}
                                                value={company.id}
                                            >
                                                {company.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth>
                                    <InputLabel>Employee</InputLabel>
                                    <Select
                                        id="employee"
                                        type="text"
                                        value={selectedEmployee}
                                        onChange={(e) =>
                                            setSelectedEmployee(e.target.value)
                                        }
                                    >
                                        <MenuItem value="">
                                            Select Employee
                                        </MenuItem>
                                        {employees.map((employee) => (
                                            <MenuItem
                                                key={employee.id}
                                                value={employee.id}
                                            >
                                                {employee.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Button variant="contained" type="submit">
                            SAVE
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Layout>
    );
}
