import "./RestaurantList.css";
import "../App.css";
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
            <li key={restaurant.id} className="list-item">
              <div className="restaurant-container">
                <div className="img-container">
                  <img src={restaurant.image} alt={restaurant.name} />
                </div>
                <aside className="restaurant-content">
                  <h2 className="restaurant-name">{restaurant.name}</h2>
                  <p className="description">{restaurant.description}</p>
                  <Link to={"restaurants/" + restaurant.id}>
                    <button className="button">Reserve now →</button>
                  </Link>
                </aside>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default RestaurantList;
