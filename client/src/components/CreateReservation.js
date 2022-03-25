import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useAuth0 } from "@auth0/auth0-react";
import "react-datepicker/dist/react-datepicker.css";
import "./CreateReservation.css";

const CreateReservation = ({ restaurantName }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [partySize, setPartySize] = useState(1);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const date = selectedDate;

    const reservation = { restaurantName, partySize, date };

    console.log(reservation);

    const accessToken = await getAccessTokenSilently();

    setIsPending(true);

    const response = await fetch("http://localhost:5001/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(reservation),
    });

    if (!response.ok) {
      setIsError(true);
      setErrorStatus(response.status);
    } else {
      alert("Reservation has been created");
      setIsPending(false);
      navigate("/");
    }
  };

  if (isError) {
    return (
      <>
        <p className="no-properties">
          Error creating a reservation (error status {errorStatus})
        </p>
        <Link to="/">
          <button className="button">Return to restaurants</button>
        </Link>
      </>
    );
  }

  return (
    <>
      <h2>Reserve {restaurantName}</h2>
      <form onSubmit={handleSubmit} className="reservation-form">
        <label className="form-label" htmlFor="guests">
          Number of guests
        </label>
        <input
          type="text"
          id="guests"
          name="guests"
          classname="form-input"
          value={partySize}
          onChange={(e) => setPartySize(e.target.value)}
        />
        <label className="form-label" htmlFor="date">
          Date
        </label>
        <DatePicker
          id="date"
          name="date"
          classname="form-input"
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
        />
        {!isPending && (
          <button type="submit" className="button">
            Submit
          </button>
        )}
        {isPending && (
          <button type="submit" className="button creating">
            Creating...
          </button>
        )}
      </form>
    </>
  );
};

export default CreateReservation;
