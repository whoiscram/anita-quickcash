import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Layout from "../../components/Layout";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import axios from "axios";
import CurrencyTextField from "@lupus-ai/mui-currency-textfield";
import FormControl from "@mui/material/FormControl";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Card, InputLabel } from "@mui/material";
import { useAuth } from "../../hooks/loginAuth";
export default function EditCompany() {
    const { id } = useParams(); // Retrieve the id parameter from the URL
    const [companyData, setCompanyData] = useState(null);
    const navigate = useNavigate();

    const [company_name, setCompanyName] = useState();
    const [cap, setCapital] = useState();
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Retrieve token from local storage
                const token = localStorage.getItem('token');
    
                // Define headers
                const headers = {
                    'Authorization': `Bearer ${token}`
                };
    
                const response = await axios.post(`/company/edit/${id}`, {}, { headers: headers });
                setCompanyData(response.data);
            } catch (error) {
                console.error("Error fetching company data:", error);
            }
        };
    
        fetchData();
    }, [id]);
    

    if (!companyData) {
        return <p>Loading...</p>;
    }

    const handleClick = async () => {
        //api call new page
        navigate("/dashboard/company");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token"); // Retrieve the token from localStorage
            const response = await axios.post(
                `/company/update/${id}`,
                {
                    company_name: company_name,
                    capital: cap, // Fix this line to set the capital value correctly
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Attach the token to the request headers
                    },
                }
            );
            console.log(response);
            window.alert("Company Updated");
            navigate("/dashboard/company");
        } catch (error) {
            console.error(error.response.data);
        }
    };



    // Render the component with fetched data
    return (
        // <Layout>
        //     <Button variant="contained" onClick={handleClick}>
        //         BACK
        //     </Button>
        //     <form onSubmit={handleSubmit}>
        //         <label htmlFor="company_name">Company Name:</label>
        //         <input
        //             type="text"
        //             id="company_name"
        //             defaultValue={companyData.name}
        //             onChange={(e) => setCompanyName(e.target.value)}
        //         />

        //         <label htmlFor="capital">Capital:</label>
        //         <input
        //             type="number"
        //             id="capital"
        //             defaultValue={companyData.capital}
        //             onChange={(e) => setCapital(e.target.value)}
        //         />
       //         button type="submit">SAVE</button>
        //     </form>
        // </Layout>

        <Layout>
            <Card>
                <CardContent>
                    <Button variant="contained" onClick={handleClick}>
                        BACK
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Grid container>
                            <FormControl>
                                <TextField
                                    id="company_name"
                                    label="Name"
                                    type="text"
                                    defaultValue={companyData.name}
                                    onChange={(e) =>
                                        setCompanyName(e.target.value)
                                    }
                                />
                            </FormControl>

                            <FormControl>
                                <CurrencyTextField
                                    label="Amount"
                                    variant="standard"
                                    defaultValue={companyData.capital}
                                    currencySymbol="₱"
                                    //minimumValue="0"
                                    outputFormat="string"
                                    decimalCharacter="."
                                    digitGroupSeparator=","
                                    onChange={(e) => setCapital(e.target.value)}
                                />
                            </FormControl>

                             <Button type="submit">SAVE</Button>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Layout>
    );
}
