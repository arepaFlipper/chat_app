import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert2";
import type { AuthContextType } from "@/types";

const API_URL = (import.meta.env.PROD && false) ? "http://telesigndem.com" : "http://localhost:8000";

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => { },
  authTokens: null,
  setAuthTokens: () => { },
  registerUser: async () => { },
  loginUser: async () => { },
  logoutUser: () => { }
});

export default AuthContext;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens") as string)
      : null
  );


  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens") as string)
      : null
  );


  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loginUser = async (email: string, password: string): Promise<void> => {
    const response = await fetch(`${API_URL}/api/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email, password
      })
    })
    const data = await response.json()
    console.log(data);

    if (response.status === 200) {
      console.log("Logged In");
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      navigate("/");
      swal.fire({
        title: "Login Successful",
        icon: "success",
        toast: true,
        timer: 6000,
        position: 'top-right',
        timerProgressBar: true,
        showConfirmButton: false,
      })

    } else {
      console.log(response.status);
      console.log("there was a server issue");
      swal.fire({
        title: "Username or passowrd does not exists",
        icon: "error",
        toast: true,
        timer: 6000,
        position: 'top-right',
        timerProgressBar: true,
        showConfirmButton: false,
      })
    }
  }

  const verification = async (username: string, code_verification: string) => {
    const response = await fetch(`${API_URL}/api/verify/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        code: code_verification
      })
    })
    if (response.status === 201) {
      navigate("/login")
      swal.fire({
        title: "Registration Successful, Login Now",
        icon: "success",
        toast: true,
        timer: 6000,
        position: 'top-right',
        timerProgressBar: true,
        showConfirmButton: false,
      })
    } else {
      console.log(response.status);
      console.log("there was a server issue");
      swal.fire({
        title: "An Error Occured " + response.status,
        icon: "error",
        toast: true,
        timer: 6000,
        position: 'top-right',
        timerProgressBar: true,
        showConfirmButton: false,
      })
    }
  }

  const registerUser = async (email: string, username: string, password: string, password2: string, phone: string) => {
    const response = await fetch(`${API_URL}/api/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email, username, password, password2, phone_number: phone,
      })
    })
    if (response.status === 201) {
      navigate(`/verification/${username}`)
      swal.fire({
        title: "Please check your email for verification code",
        icon: "success",
        toast: true,
        timer: 6000,
        position: 'top-right',
        timerProgressBar: true,
        showConfirmButton: false,
      })
    } else {
      console.log(response.status);
      console.log("there was a server issue");
      swal.fire({
        title: "An Error Occured " + response.status,
        icon: "error",
        toast: true,
        timer: 6000,
        position: 'top-right',
        timerProgressBar: true,
        showConfirmButton: false,
      })
    }
  }

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/login");
    swal.fire({
      title: "YOu have been logged out...",
      icon: "success",
      toast: true,
      timer: 6000,
      position: 'top-right',
      timerProgressBar: true,
      showConfirmButton: false,
    })
  }

  const contextData = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    registerUser,
    loginUser,
    logoutUser,
    verification,
  }

  useEffect(() => {
    if (authTokens) {
      setUser(jwtDecode(authTokens.access))
    }
    setLoading(false)
  }, [authTokens, loading])

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  )

}
