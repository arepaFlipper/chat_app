import { Navigate } from "react-router-dom"
import { useContext } from "react"
import AuthContext from "../context/AuthContext"

type Props = {
  children: React.ReactNode;
  isAuthenticated?: boolean;
  path: string;
}

const PrivateRoute = ({ children, path }: Props) => {
  const { user } = useContext<any>(AuthContext)
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return (
    <>{children}</>
  )
}

export default PrivateRoute
