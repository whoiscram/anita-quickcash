

// TO BE REMOVED
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Users from './pages/Users';
import Register from './pages/Register';
import Loans from './pages/Loans';
function Main(){
    return(
        <Router>
            <Routes>
                <Route exact path="/"  element={<Home/>} />
                <Route exact path="/about"  element={<About/>} />
                <Route exact path="/login"  element={<Login/>} />
                <Route exact path='/loans' element={<Loans/>}/>
                <Route exact path='/register' element={<Register/>}/>
                <Route exact path='/users' element={<Users/>}/>
            </Routes>
        </Router>

        
    )
}

export default Main;
   
if (document.getElementById('root')) {
    ReactDOM.render(<Main />, document.getElementById('root'));
}