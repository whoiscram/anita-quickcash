import React, {createContext, useState} from 'react';
import axios from 'axios';
export const AuthProvider = ({children}) =>{
    const [token , setToken] = useState(localStorage.getItem('token'));

    const login = async (email,password)=>{
        try{
            const response = axios.post('/login', {email,password});
            localStorage.setItem('token', response.data.token);
            setToken(response.data);
                
            
        }catch(err){
            console.error('Login Failed', err);
        }
    
    }

    const logout = () =>{
        localStorage.removeItem('token');
        setToken(null);
    }

    return(
        <AuthContext.Provider value={{token, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;