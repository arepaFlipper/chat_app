import React, { useState, useEffect } from 'react';
import "./style/Message.css";
import useAxios from "../utils/useAxios";
import jwtDecode from "jwt-decode";
import moment from "moment";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2'


function SearchUsers() {
  const baseURL = "http://127.0.0.1:8000/api";
  let [newSearch, setNewSearch] = useState({ search: "" });
  const [users, setUsers] = useState([]);

  const { username } = useParams();
  const token = localStorage.getItem("authTokens");
  const decoded = jwtDecode(token);
  const user_id = decoded.user_id;

  const axios = useAxios();

  const history = useHistory();

  const handleSearchChange = (e) => {

  }

  useEffect(() => {
    axios.get(`${baseURL}/search/${username}/`).then((res) => {
      setUsers(res.data);
    }).catch((err) => {
      Swal.fire({
        title: "User does not exist",
        icon: "error",
        toast: true,
        timer: 2000,
        position: "middle",
      })

    });
  }, []);

  const SearchUser = () => {
    try {
      axios.get(`${baseURL}/search/${newSearch.username}/`).then((res) => {
        history.push(`/search/${newSearch.username}/`);
        setUsers(res.data);
      }).catch((err) => {
        if (err.response.status === 404) {
          alert("User not found");
        }
      })
    } catch (err) {

    }
  }

  return (
    <div>
      <div>
        <main className="content" style={{ marginTop: "150px" }}>
          <div className="container p-0">
            <h1 className="h3 mb-3">Messages</h1>
            <div className="card">
              <div className="row g-0">
                <div className="col-12 col-lg-5 col-xl-3 border-right">
                  <div className="px-4 ">
                    <div className="d-flfex align-itemfs-center">
                      <div className="flex-grow-1 d-flex align-items-center mt-2">
                        <input
                          type="text"
                          className="form-control my-3"
                          placeholder="Search..."
                          onChange={handleSearchChange}
                          name='username'

                        />
                        <button className='ml-2' style={{ border: "none", borderRadius: "50%" }}><i className='fas fa-search'></i></button>
                      </div>
                    </div>
                  </div>

                  {users.map((user, index) =>
                    <Link
                      to={"/inbox/" + user.id}
                      className="list-group-item list-group-item-action border-0"
                      key={index}
                    >

                      <small><div className="badge bg-success float-right text-white"></div></small>
                      <div className="d-flex align-items-start">
                        <img src={user.image} className="rounded-circle mr-1" alt="1" width={40} height={40} />

                        <div className="flex-grow-1 ml-3">
                          {user.full_name}

                          <div className="small">
                            <small><i className='fas fa-envelope'> Send Message</i></small>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}

                  <hr className="d-block d-lg-none mt-1 mb-0" />
                </div>

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchUsers;
