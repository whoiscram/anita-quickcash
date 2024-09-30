import React from "react";
import Header from "../components/Header";
import Layout from "../components/Layout";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { Card, InputLabel, TextField } from "@mui/material";

export default function About() {
    return (
        <Layout>
        <Card sx={{height: 600}}>
            <CardContent>
                <Typography variant="h2" gutterBottom>
                    About Page
                </Typography>
                <Typography variant="body1">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Sed fringilla velit sed enim volutpat, vel volutpat
                    libero fringilla. Quisque non nisi at nisi venenatis
                    pretium. Fusce gravida nibh ac risus fermentum, vel
                    efficitur libero finibus. Nullam in magna eu velit
                    convallis tincidunt. Duis auctor tempor libero, at
                    varius urna gravida vitae. Aenean ac augue non purus
                    dignissim commodo. Sed sodales libero id nisi
                    consectetur, ac condimentum justo scelerisque. Cras
                    ullamcorper lacus nec odio accumsan, nec ullamcorper
                    libero fringilla. In eget arcu nisl. Donec vel odio ut
                    lacus hendrerit accumsan.
                </Typography>
                <Typography variant="body1">
                    Suspendisse nec consequat metus. Cras non semper urna.
                    Mauris consequat ex sit amet quam tincidunt tincidunt.
                    Morbi ut ligula eget justo vehicula malesuada id eget
                    leo. Nam posuere nulla nec lectus rhoncus, id fermentum
                    orci sodales. Mauris euismod porttitor metus, id
                    sollicitudin nisi malesuada eu. Fusce quis dui ut sapien
                    suscipit finibus. Proin tincidunt suscipit metus.
                    Suspendisse potenti.
                </Typography>
            </CardContent>
        </Card>
    </Layout>
    );
}
