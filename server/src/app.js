const express = require("express");
const cors = require("cors");
const app = express();
const RestaurantModel = require("./models/RestaurantModel");

app.use(cors());
app.use(express.json());

app.get("/restaurants", async (req, res) => {
  const restaurants = await RestaurantModel.find({});
  return res.status(200).send(restaurants);
});

// app.get("/restaurants/:id", async (req, res) => {
//     const id = req.params.id;
//     if (validId(id) === false) {
//       return res.status(400).send({ message: "id provided is invalid" });
//     }
//     const reservation = await ReservationModel.findById(id);
//     if (reservation === null) {
//       return res.status(404).send({ message: "id not found" });
//     }
//     const formattedReservation = formatReservation(reservation);
//     return res.status(200).send(formattedReservation);
//   });

// app.get("*", async (req, res) => {
//   return res.status(404).send({ message: "page not found" });
// });

module.exports = app;
