import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { formatDate } from "../utils/formatDate";
import { useAuth0 } from "@auth0/auth0-react";
import "./Reservation.css";
import BackButton from "./BackButton";

const Reservation = () => {
  const { getAccessTokenSilently } = useAuth0();
  const { id } = useParams();
  const [reservation, setReservation] = useState({});
  const [isNotFound, setIsNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAccessTokenSilently();
      const fetchUrl = `http://localhost:5001/reservations/${id}`;
      const response = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok === false) {
        setIsNotFound(true);
        return;
      }
      const data = await response.json();
      setReservation(data);
      setIsLoading(false);
    };
    fetchData();
  }, [id, getAccessTokenSilently]);

  if (isNotFound) {
    return (
      <>
        <p className="error">Sorry! We can't find that reservation</p>
        <BackButton resource="reservations" endpoint="/reservations" />
      </>
    );
  }

  return (
    <>
      <h1>Reservation</h1>
      <h2>{reservation.restaurantName}</h2>
      <p>{reservation.date}</p>
      <p>
        <strong>Party size: </strong>4
      </p>
      <hr />
    </>
  );
};

export default Reservation;
