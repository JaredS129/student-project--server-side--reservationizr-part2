import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CreateReservation from "./CreateReservation";
import "./Restaurant.css";
import BackButton from "./BackButton";

const Restaurant = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState({});
  const [isNotFound, setIsNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const fetchUrl = `http://localhost:5001/restaurants/${id}`;
      const response = await fetch(fetchUrl);

      if (response.ok === false) {
        setIsNotFound(true);
        return;
      }

      const data = await response.json();
      setRestaurant(data);
      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  if (isNotFound) {
    return (
      <>
        <p className="error">Sorry! We can't find that restaurant</p>
        <BackButton />
      </>
    );
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div>
        <img src={restaurant.image} alt={restaurant.name} />
        <aside>
          <h2>{restaurant.name}</h2>
          <p>{restaurant.description}</p>
        </aside>
      </div>
      <CreateReservation restaurantName={restaurant.name} />
    </>
  );
};

export default Restaurant;
