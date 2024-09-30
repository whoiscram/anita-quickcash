import React from 'react'
import Header from '../components/Header';
import Layout from '../components/Layout';

import Button from "@mui/material/Button";


import { useNavigate } from 'react-router-dom'; 
export default function Home(){

    const navigate = useNavigate();

    
    const handleClick = () => {
        //api call new page
        navigate("/home");
    };

    return (
    
        <Layout>    
    
        <div>
            <h2>you dont have access to this page</h2>
            <Button variant="contained" onClick={handleClick}>
                BACK
            </Button>
            
        </div>
    </Layout>
    
    );
}