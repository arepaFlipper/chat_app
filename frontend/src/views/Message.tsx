import { useState, useEffect } from 'react';
import "@/views/style/Message.css";
import useAxios from "@/utils/useAxios";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import type { TMessage } from "@/types";

const Message = () => {
  // NOTE: Define base api url
  const BASE_URL = import.meta.env.BASE_URL;

  // NOTE: create new states
  const [messages, setMessages] = useState([]);

  const axios = useAxios();

  // NOTE: get token
  const token = localStorage.getItem("authTokens");
  const decoded: { user_id: number } = jwtDecode(token as string);
  const user_id = decoded.user_id;
  const navigate = useNavigate();

  const [newMessage, setNewMessage] = useState({ message: "" });
  const [newSearch, setNewSearch] = useState({ username: "" });

  const handleNewMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage({
      ...newMessage,
      [event.target.name]: event.target.value
    })
  }

  const SendMessage = () => {
    const formData = new FormData();
    formData.append("user", user_id as unknown as string);
    formData.append("sender", user_id as unknown as string);
    formData.append("receiver", 1 as unknown as string);
    formData.append("message", newMessage.message as unknown as string);
    formData.append("is_read", false as unknown as string);

    try {
      axios.post(`${BASE_URL}/get-messages/`, formData).then((res) => {
        console.log(res.data);
        setNewMessage({ message: "" });
        axios.get(`${BASE_URL}/get-messages/${user_id}/1/`).then((res) => {
          setMessages(res.data);
        }).catch((err) => {
          console.log(err);
        });

        // window.location.reload();
      }).catch((err) => {
        console.log(err);
      });

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const url = `${BASE_URL}/my-messages/${user_id}/`;
      try {
        axios.get(url)
          .then((res) => {
            const sortedMessages = res.data.sort((a: { date: string }, b: { date: string }) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setMessages(sortedMessages);
          }).catch((err) => {
          })
      } catch (error) {
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    }
  }, []);

  const SearchUser = () => {
    axios.get(`${BASE_URL}/search/${newSearch.username}/`).then((res) => {
      navigate(`/search/${newSearch.username}/`);
    }).catch((err) => {
      if (err.response.status === 404) {
        alert("User not found");
      }
    })
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewSearch({
      ...newSearch,
      [event.target.name]: event.target.value
    });
  };

  return (
    <main className="content" style={{ marginTop: "150px" }}>
      <div className="container p-0">
        <h1 className="h3 mb-3">Messages</h1>
        <div className="card">
          <div className="row g-0">
            <div className="col-12 col-lg-5 col-xl-3 border-right">
              <div className="px-4 d-none d-md-block">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 d-flex">
                    <input type="text" className="form-control my-3" placeholder="Search..." onChange={handleSearchChange} name="username" />
                    <button onClick={SearchUser} className="ml-2">
                      <i className="fas fa-search" style={{ border: "none", background: "none" }}></i>
                    </button>
                  </div>
                </div>
              </div>

              {messages.map((msg: TMessage, idx) => {
                return (
                  <Link to={`/inbox/${msg.sender}`} key={idx} className="list-group-item list-group-item-action border-0" >
                    <div className="badge bg-success float-right text-white">
                      {moment.utc(msg.date).local().startOf('seconds').fromNow()}
                    </div>
                    <div className="d-flex align-items-start">
                      {msg.sender !== user_id && (
                        <img src={msg.receiver_profile.image} style={{ objectFit: "cover" }} className="rounded-circle mr-1" alt={msg.sender_profile.full_name} width={40} height={40} />
                      )}
                      {msg.sender === user_id && (
                        <img src={msg.sender_profile.image} className="rounded-circle mr-1" alt="Sharon Lessman" width={40} height={40} />
                      )}
                      <div className="flex-grow-1 ml-3">
                        {(msg.sender !== user_id) && (<h6 className="mb-1">{msg.receiver_profile.username}</h6>)}
                        {(msg.sender === user_id) && (<h6 className="mb-1">{msg.sender_profile.username}</h6>)}
                        <div className="small">
                          <span className="fas fa-circle chat-online" /> {msg.message}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}

              <hr className="d-block d-lg-none mt-1 mb-0" />
            </div>
            <div className="col-12 col-lg-7 col-xl-9">
              <div className="py-2 px-4 border-bottom d-none d-lg-block">
                <div className="d-flex align-items-center py-1">
                  <div className="position-relative">
                    <img
                      src="https://bootdey.com/img/Content/avatar/avatar3.png"
                      className="rounded-circle mr-1"
                      alt="Sharon Lessman"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="flex-grow-1 pl-3">
                    <strong>Sharon Lessman</strong>
                    <div className="text-muted small">
                      <em>Online</em>
                    </div>
                  </div>
                  <div>
                    <button className="btn btn-primary btn-lg mr-1 px-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-phone feather-lg"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </button>
                    <button className="btn btn-info btn-lg mr-1 px-3 d-none d-md-inline-block">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-video feather-lg"
                      >
                        <polygon points="23 7 16 12 23 17 23 7" />
                        <rect x={1} y={5} width={15} height={14} rx={2} ry={2} />
                      </svg>
                    </button>
                    <button className="btn btn-light border btn-lg px-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-more-horizontal feather-lg"
                      >
                        <circle cx={12} cy={12} r={1} />
                        <circle cx={19} cy={12} r={1} />
                        <circle cx={5} cy={12} r={1} />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="position-relative">
                <div className="chat-messages p-4">
                  {messages.map((msg: TMessage, idx) => {
                    return (
                      <div key={idx} className="chat-message-right pb-4">
                        <div>
                          <img
                            src={msg.sender_profile.image}
                            className="rounded-circle mr-1"
                            alt="Chris Wood"
                            width={40}
                            height={40}
                          />
                          <div className="text-muted small text-wrap mt-2">
                            {moment.utc(msg.date).local().startOf("seconds").fromNow()}
                          </div>
                        </div>
                        <div className="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                          <div className="font-weight-bold mb-1">You</div>
                          {msg.message}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="flex-grow-0 py-3 px-4 border-top">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type your message"
                    name="message"
                    value={newMessage.message}
                    onChange={handleNewMessage}
                    id="text-input"
                  />
                  <button className="btn btn-primary" onClick={SendMessage}>Send</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Message;

