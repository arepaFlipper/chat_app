import './style/Message.css';
import { useState, useEffect } from 'react';
import useAxios from '@/utils/useAxios';
import { Link, useParams, useNavigate } from 'react-router-dom/';
import swal, { SweetAlertPosition } from "sweetalert2";
import type { TProfile } from '@/types';

// Define the SearchUsers component
const SearchUsers = () => {

  // Accessing BASE_URL and initializing necessary hooks
  const BASE_URL = import.meta.env.BASE_URL;
  const axios = useAxios();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [newSearch, setnewSearch] = useState({ username: "", });
  const [loading, setLoading] = useState(true);

  // Retrieving username parameter from URL
  const { username } = useParams();

  // Effect hook to fetch users based on search query
  useEffect(() => {
    axios.get(`${BASE_URL}/search/${newSearch.username}/`)
      .then((res) => {
        setUsers(res.data)
      })
      .catch((error) => {
        // Display error message if user does not exist
        swal.fire({
          title: "User Does Not Exist",
          icon: "error",
          toast: true,
          timer: 2000,
          position: 'middle' as SweetAlertPosition,
          timerProgressBar: true,
          showConfirmButton: false,
          showCancelButton: true,
        });
      });
  }, [])

  // Function to handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setnewSearch({
      ...newSearch,
      [event.target.name]: event.target.value,
    });

  };

  // Function to perform user search
  const SearchUser = () => {
    if (newSearch.username === "") return;
    axios.get(`${BASE_URL}/search/${newSearch.username}/`)
      .then((res) => {
        navigate(`/search/${newSearch.username}/`);
        setUsers(res.data)
      })
      .catch((error) => {
        // Display error message if user does not exist
        swal.fire({
          title: "User Does Not Exist",
          icon: "error",
          toast: true,
          timer: 2000,
          position: 'middle' as SweetAlertPosition,
          timerProgressBar: true,
          showConfirmButton: false,
          showCancelButton: true,
        })
      });
  };

  // Return the JSX for the SearchUsers component
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
                        <button className='ml-2' onClick={SearchUser} style={{ border: "none", borderRadius: "50%" }}><i className='fas fa-search'></i></button>
                      </div>
                    </div>
                  </div>

                  {/* Display users */}
                  {users.map((user: TProfile, index) => {
                    return (
                      <Link
                        to={"/inbox/" + user.id}
                        className="list-group-item list-group-item-action border-0"
                        key={index}
                      >
                        <small><div className="badge bg-success float-right text-white"></div></small>
                        <div className="d-flex align-items-start">
                          <img src={user.image} className="rounded-circle mr-1" alt="1" width={40} height={40} />
                          <div className="flex-grow-1 ml-3">
                            {user.username}
                            <div className="small">
                              <small><i className='fas fa-envelope'> Send Message</i></small>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                  <hr className="d-block d-lg-none mt-1 mb-0" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default SearchUsers

