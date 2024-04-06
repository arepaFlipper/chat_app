import React, { useState, useEffect } from 'react'
import "./style/Message.css";
import useAxios from "../utils/useAxios";
import jwtDecode from "jwt-decode";
import moment from "moment";
import { useParams } from "react-router-dom"

function MessageDetail() {
  const baseURL = "http://127.0.0.1:8000/api";
  const [message, setMessage] = useState([]);

  const { id } = useParams();
  const token = localStorage.getItem("authTokens");
  const decoded = jwtDecode(token);
  const user_id = decoded.user_id;

  const axios = useAxios();

  useEffect(() => {
    try {
      axios.get(`${baseURL}/get-messages/${user_id}/${id}/`).then((res) => {
        setMessage(res.data);
      }).catch((err) => { })
    } catch (error) {

    }
  }, []);

  return (
    <div>MessageDetail</div>
  );
};

export default MessageDetail;
