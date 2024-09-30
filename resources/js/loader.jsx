import axios from "axios";
import { useNavigate } from "react-router-dom";

export const loader = async () => {
  const navigate = useNavigate(); // Access the useNavigate hook inside a functional component

  try {
    const response = await axios.post("/users");
    if (response.status !== 200) {
      throw Error("User Invalid");
    }
  } catch (error) {
    // Use programmatic navigation with useNavigate
    navigate("/login");
  }
};

export default loader;
