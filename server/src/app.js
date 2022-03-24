const express = require("express");
const cors = require("cors");
const app = express();
const RestaurantModel = require("./models/RestaurantModel");
const validId = require("./utils/validId");

app.use(cors());
app.use(express.json());

app.get("/restaurants", async (req, res) => {
  const restaurants = await RestaurantModel.find({});
  return res.status(200).send(restaurants);
});

app.get("/restaurants/:id", async (req, res) => {
  const id = req.params.id;
  if (validId(id) === false) {
    return res.status(400).send({ error: "invalid id provided" });
  }
  const restaurant = await RestaurantModel.findById(id);
  if (restaurant === null) {
    return res.status(404).send({ error: "restaurant not found" });
  }
  return res.status(200).send(restaurant);
});

app.get("*", async (req, res) => {
  return res.status(404).send({ error: "page not found" });
});

module.exports = app;
