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
      const fetchUrl = `${process.env.REACT_APP_API_URL}/reservations/${id}`;
      const response = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok === false) {
        setIsNotFound(true);
        setIsLoading(false);
        return;
      }
      const data = await response.json();
      setReservation(data);
      setIsLoading(false);
    };
    fetchData();
  }, [id, getAccessTokenSilently]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

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
      <h1 className="single-reservation-heading">Reservation</h1>
      <h2 className="single-reservation-name">{reservation.restaurantName}</h2>
      <p className="single-reservation-date">{formatDate(reservation.date)}</p>
      <p className="single-reservation-party">
        <strong>Party size: </strong>
        {reservation.partySize}
      </p>
      <hr className="single-reservation-divider" />
      <BackButton resource="reservations" endpoint="/reservations" />
    </>
  );
};

export default Reservation;
