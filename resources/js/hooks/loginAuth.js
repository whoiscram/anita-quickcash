// roles.js
import { createStore, createHook, createStateHook } from "react-sweet-state";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const initialState = {
    isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
    userRoles: [],
};

const authStore = createStore({
    initialState,
    actions: {
        login:
            (email, password, navigate) =>
            async ({ setState }) => {
                try {
                    const response = await axios.post("/login", {
                        email,
                        password,
                    });

                    const { access_token, roles, email_,permissions,company_id } = response.data;
                    localStorage.setItem("token", access_token);
                    localStorage.setItem("email", email_);
                    localStorage.setItem("roles", roles);
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("company", company_id); 
                    const getRole = localStorage.getItem(roles);
                    const getCompany = localStorage.getItem("company"); 
                    setState({
                        isLoggedIn: true,
                        userRoles: roles,
                        email_: email_,
                        permissions: permissions,
                        company_id: company_id,
                        access_token: access_token,
                    });
        

                    // Navigate to dashboard or any other authenticated route
                    navigate("/home");
                } catch (error) {
                    console.error("Login error:", error);
                    window.alert(error.response.data.message);
                }
            },
        logout:
            (navigate) =>
            ({ setState }) => {
                // Perform logout logic here
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("token");
                localStorage.removeItem("email");
                localStorage.removeItem("roles");
                localStorage.removeItem("company");
                navigate("/login");
                location.reload();
                setState(initialState);
            },
    },
});

// export const useAuth = createHook(authStore);
export const useAuth = createHook(authStore, {
    selector: (state) => ({
        isLoggedIn: state.isLoggedIn,
        userRoles: state.userRoles,
        company_id: state.company_id,
        userID: state.userID,
        permissions: state.permissions,
        access_token: state.access_token,
    }),
});

export const useAuthState = createStateHook(authStore);
