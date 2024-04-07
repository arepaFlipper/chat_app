import axios from "axios"; // Importing axios for making HTTP requests
import { jwtDecode } from "jwt-decode"; // Importing jwtDecode to decode JWT tokens
import dayjs from "dayjs"; // Importing dayjs for date manipulation
import { useContext } from "react"; // Importing useContext hook from React
import AuthContext from "@/context/AuthContext"; // Importing AuthContext for accessing authentication context

// Getting the base URL from environment variables
const BASE_URL = import.meta.env.BASE_URL;

// Custom hook for axios instance with authentication handling
const useAxios = () => {
  // Accessing authentication context
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);

  // Creating axios instance with base URL and authorization header
  const axiosInstance = axios.create({
    BASE_URL,
    headers: { Authorization: `Bearer ${authTokens?.access}` }
  });

  // Intercepting requests to handle token expiration
  axiosInstance.interceptors.request.use(async req => {
    // Decoding the access token
    const user = jwtDecode(authTokens.access);
    // Checking if the token is expired
    const isExpired = dayjs.unix(user.exp as number).diff(dayjs()) < 1;

    // If token is not expired, continue with the request
    if (!isExpired) return req;

    // If token is expired, refresh the token
    const response = await axios.post(`${BASE_URL}/token/refresh/`, {
      refresh: authTokens.refresh
    });

    // Updating authTokens and user in local storage and context
    localStorage.setItem("authTokens", JSON.stringify(response.data));
    setAuthTokens(response.data);
    setUser(jwtDecode(response.data.access));

    // Updating authorization header with new access token
    req.headers.Authorization = `Bearer ${response.data.access}`;
    return req;
  });

  // Return the axios instance
  return axiosInstance;
};

export default useAxios;

