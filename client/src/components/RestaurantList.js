import "./RestaurantList.css";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);

  const fetchData = async () => {
    const response = await fetch("http://localhost:5001/restaurants");
    const data = await response.json();
    setRestaurants(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <h1>Restaurants</h1>
      <ul>
        {restaurants.map((restaurant) => {
          return (
            <li key={restaurant.id}>
              <img src={restaurant.image} alt={restaurant.name} />
              <h2>{restaurant.name}</h2>
              <p>{restaurant.description}</p>
              <Link to={"restaurants/" + restaurant.id}>Reserve now →</Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default RestaurantList;
