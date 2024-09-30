import React, { useState } from "react";
import Layout from "../../components/Layout";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router";
import { Card, InputLabel } from "@mui/material";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import CardContent from "@mui/material/CardContent";
import axios from "axios";
import CurrencyTextField from "@lupus-ai/mui-currency-textfield";

export default function AddCompany() {
    const navigate = useNavigate();
    const [company_name, setCompanyName] = useState("");
    const [capital, setCapital] = useState("");

    const handleClick = () => {
        //api call new page
        navigate("/dashboard/company");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "/company/add",
                {
                    company_name,
                    capital,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            window.alert("Company Created");
            navigate("/dashboard/company");
        } catch (error) {
            console.error(error.response.data);
        }
    };

    return (
        <Layout>
            <Card>
                <CardContent>
                    <Button variant="contained" onClick={handleClick}>
                        BACK
                    </Button>
                    <form onSubmit={handleSubmit} method="post">
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <TextField
                                        id="company_name"
                                        label="Company Name"
                                        type="text"
                                        value={company_name}
                                        onChange={(e) =>
                                            setCompanyName(e.target.value)
                                        }
                                    />
                                </FormControl>
                                <FormControl fullWidth>
                                    <CurrencyTextField
                                        label="Capital"
                                        variant="standard"
                                        value={capital}
                                        currencySymbol="₱"
                                        outputFormat="string"
                                        decimalCharacter="."
                                        digitGroupSeparator=","
                                        onChange={(e) =>
                                            setCapital(e.target.value)
                                        }
                                    />
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
