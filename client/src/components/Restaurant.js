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
      const fetchUrl = `${process.env.REACT_APP_API_URL}/restaurants/${id}`;
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
        <BackButton resource="restaurants" endpoint="/" />
      </>
    );
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="single-restaurant">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="restaurant-image"
        />
        <aside className="single-restaurant-content">
          <h2 className="single-restaurant-name">{restaurant.name}</h2>
          <p className="single-restaurant-description">
            {restaurant.description}
          </p>
        </aside>
      </div>
      <CreateReservation restaurantName={restaurant.name} />
    </>
  );
};

export default Restaurant;
