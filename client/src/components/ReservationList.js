import "./ReservationList.css";
import "../App.css";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { formatDate } from "../utils/formatDate";

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const { getAccessTokenSilently } = useAuth0();

  const fetchData = async () => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch("http://localhost:5001/reservations", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    setReservations(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <h1>Upcoming reservations</h1>
      <ul>
        {reservations.map((reservation) => {
          return (
            <li key={reservation.id} className="list-item">
              <div className="reservations-container">
                <h2 className="reservation-name">
                  {reservation.restaurantName}
                </h2>
                <p className="reservation-date">
                  {formatDate(reservation.date)}
                </p>
                <a
                  href={"reservations/" + reservation.id}
                  className="reservation-link"
                >
                  View details →
                </a>
              </div>
              <hr className="reservation-divider" />
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default ReservationList;
