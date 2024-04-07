import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import PrivateRoute from "./utils/PrivateRoute"
import { AuthProvider } from './context/AuthContext'

import Homepage from './views/Homepage'
import Registerpage from './views/Registerpage'
import Loginpage from './views/Loginpage'
import Dashboard from './views/Dashboard'
import Navbar from './views/Navbar'
import Todo from './views/Todo'
import Message from './views/Message'
import MessageDetail from './views/MessageDetail'
import SearchUsers from './views/SearchUsers'

function App() {
  return (
    <Router>
      <AuthProvider>
        < Navbar />
        <Routes>
          {/* <PrivateRoute element={<Dashboard />} path="/dashboard" /> */}
          {/* <PrivateRoute element={<Message />} path="/inbox" /> */}
          {/* <PrivateRoute element={<MessageDetail />} path="/inbox/:id" /> */}
          {/* <PrivateRoute element={<SearchUsers />} path="/search/:username" /> */}
          <Route element={<Loginpage />} path="/login" />
          <Route element={<Registerpage />} path="/register" />
          <Route element={<Homepage />} path="/" />
          <Route element={<Todo />} path="/todo" />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
