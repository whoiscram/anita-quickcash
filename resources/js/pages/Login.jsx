import Header from "../components/Header";
import Layout from "../components/Layout";
import { Card, InputLabel, TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth, useAuthState } from "../hooks/loginAuth"; // Make sure the path is correct

function Login() {
    const navigate = useNavigate();
    const [state, actions] = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await actions.login(email, password, navigate);
        } catch (error) {
            console.error("Login error:", error);
            window.alert(error.response.data.error);
        }
    };

    return (
        <Layout>
           <Card sx={{height: 600}}>
                <CardContent>
                    <Typography variant="h3" component="h2" gutterBottom >
                      LOGIN 
                    </Typography>
                  
                        <form onSubmit={handleSubmit}>
                            <FormControl fullWidth >
                                <TextField
                                    label="Email"
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </FormControl>

                            <FormControl fullWidth>
                                <TextField
                                    label="Password"
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    
                                />
                            </FormControl>
                            <Button variant="contained" type="submit">
                                LOG IN
                            </Button>
                        </form>
             
                </CardContent>
            </Card>
        </Layout>
    );
}

export default Login;
