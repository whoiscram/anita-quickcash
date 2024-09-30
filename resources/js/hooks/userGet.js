import { createStore, createHook, createStateHook } from "react-sweet-state";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const initialState = {
    isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
    company_id: [],
};

const authStore = createStore({
    initialState,
    actions:{
        getUser:
        (company_id) =>
        async ({setState}) => {
            try{

                
            }catch(error){
                console.errot("Fail", error);
            }
        }
    }
})