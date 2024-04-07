import { Route, Redirect } from "react-router-dom"
import { useContext } from "react"
import AuthContext from "../context/AuthContext"

type Props = {
  children: JSX.Element;
  isAuthenticated: boolean;
}

const PrivateRoute = ({ children, ...rest }: Props) => {
  const { user } = useContext(AuthContext)
  return <Route {...rest} > {!user ? <Redirect to="/login" /> : children
  }</Route>
}

export default PrivateRoute
