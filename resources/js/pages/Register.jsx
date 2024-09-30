import React from 'react'
import Header from '../components/Header';
import Layout from '../components/Layout';
import { useState } from 'react';
export default function Register(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    //const {login} = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        //const sucess = await login(email,password);
        try {
            const response = await axios.post("register", {
                email,
                password,
                name,
            }); 

            window.location.href ='/login'
        
            // if(sucess){
            //     window.location.href ='/dasboard'
            // }


        } catch (error) {
            console.error(error.response.data);
        }
    };

    return (
        <Layout>
            <Header />
            <div>
                <h1>Register </h1>
                <form onSubmit={handleSubmit}>
                <label htmlFor="email">Name:</label>
                    <input
                        type="name"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit">Register</button>
                </form>
            </div>
        </Layout>
    );
}
