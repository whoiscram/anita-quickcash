import React from "react";
import Layout from "../../components/Layout";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { Card, InputLabel, TextField } from "@mui/material";
import CurrencyTextField from "@lupus-ai/mui-currency-textfield";
import Box from "@mui/material/Box";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function RequestLoan() {
    const [formData, setFormData] = useState({
        loan_amount: "",
        term: "",
    });
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("/loans/request_loan", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            navigate("/dashboard/profile");
        } catch (error) {
            console.log(error)
            window.alert(error.response.data.error);
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleClick = () => {
        navigate("/dashboard/loanRequest");
    };

    return (
        <Layout>
            <Card sx={{ height: 600 }}>
                <CardContent>
                    <Button variant="contained" onClick={handleClick}>
                        BACK
                    </Button>
                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth>
                            <CurrencyTextField
                                id="loan_amount"
                                label="Loan Amount"
                                outputFormat="number"
                                currencySymbol="₱"
                                value={formData.loan_amount}
                                onChange={handleChange}
                                variant="filled"
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
                        <Button variant="contained" type="submit">
                            SUBMIT
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Layout>
    );
}
