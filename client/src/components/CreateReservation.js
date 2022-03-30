import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useAuth0 } from "@auth0/auth0-react";
import "react-datepicker/dist/react-datepicker.css";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import "./CreateReservation.css";

const CreateReservation = ({ restaurantName }) => {
  const [selectedDate, setSelectedDate] = useState(
    setHours(setMinutes(new Date(), 0), 9)
  );

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

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/reservations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(reservation),
      }
    );

    if (!response.ok) {
      setIsError(true);
      setErrorStatus(response.status);
    } else {
      alert("Reservation has been created");
      setIsPending(false);
      navigate("/reservations");
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
    <div className="reservation-form">
      <h2 className="reserve-title">Reserve {restaurantName}</h2>
      <form onSubmit={handleSubmit}>
        <label className="form-label" htmlFor="guests">
          Number of guests
        </label>
        <input
          type="number"
          id="guests"
          name="guests"
          className="form-input"
          value={partySize}
          onChange={(e) => setPartySize(e.target.value)}
        />
        <label className="form-label" htmlFor="date">
          Date
        </label>
        <DatePicker
          id="date"
          name="date"
          className="form-input"
          selected={selectedDate}
          // CITATION:
          // Description: disable manual typing in the date picker input field
          // Title of post: "How to disable typing in React DatePicker".
          // Date posted: September 8th, 2021
          // URL: https://infinitbility.com/how-to-disable-typing-in-react-datepicker
          onChangeRaw={(e) => e.preventDefault()}
          onChange={(date) => setSelectedDate(date)}
          showTimeSelect
          dateFormat="MM/dd/yyyy, h:mm aa"
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
    </div>
  );
};

export default CreateReservation;
