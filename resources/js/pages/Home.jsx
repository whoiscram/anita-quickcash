import React from "react";
import Header from "../components/Header";
import Layout from "../components/Layout";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { Card, InputLabel, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
export default function Home() {


    const navigate = useNavigate();

    
    const handleNav = () => {
        navigate("/dashboard/loanRequest");
    };

    return (
        <Layout>
            <Card sx={{ height: 600 }}>
                <CardContent>
                    <Typography variant="h2" gutterBottom>
                        Quick - Cash
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Welcome to QuickCash.ph - your go-to solution for
                        streamlined loan applications! Our platform is designed
                        as a standalone single-page application (SPA), catering
                        to various companies seeking efficient loan management
                        solutions. With QuickCash.ph, businesses can seamlessly
                        extend loan services to their employees, ensuring
                        hassle-free access to financial assistance. Our SPA is
                        meticulously crafted to provide a user-friendly
                        experience, allowing companies to leverage our system
                        effortlessly. Whether it's managing loan requests,
                        processing applications, or facilitating disbursements,
                        QuickCash.ph simplifies the entire loan lifecycle.
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Suspendisse nec consequat metus. Cras non semper urna.
                        Mauris consequat ex sit amet quam tincidunt tincidunt.
                        Morbi ut ligula eget justo vehicula malesuada id eget
                        leo. Nam posuere nulla nec lectus rhoncus, id fermentum
                        orci sodales. Mauris euismod porttitor metus, id
                        sollicitudin nisi malesuada eu. Fusce quis dui ut sapien
                        suscipit finibus. Proin tincidunt suscipit metus.
                        Suspendisse potenti.
                    </Typography>
                    <Button onClick={handleNav}> Request a Loan </Button>
                </CardContent>
            </Card>

       
        </Layout>
    );
}
