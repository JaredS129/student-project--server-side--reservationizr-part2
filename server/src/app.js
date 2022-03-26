const express = require("express");
const cors = require("cors");
const app = express();
const RestaurantModel = require("./models/RestaurantModel");
const ReservationModel = require("./models/ReservationModel");
const validId = require("./utils/validId");
const { auth } = require("express-oauth2-jwt-bearer");
const { celebrate, Joi, errors, Segments } = require("celebrate");

const checkJwt = auth({
  audience: "https://reservationizr.com",
  issuerBaseURL: `https://dev-j6gr4qvb.us.auth0.com/`,
});

app.use(cors());
app.use(express.json());

app.get("/restaurants", async (req, res) => {
  const restaurants = await RestaurantModel.find({});
  return res.status(200).send(restaurants);
});

app.get("/reservations", checkJwt, async (req, res) => {
  const { auth } = req;
  const userId = auth.payload.sub;
  const reservations = await ReservationModel.find({ userId: userId });
  return res.status(200).send(reservations);
});

app.get("/reservations/:id", checkJwt, async (req, res) => {
  const { auth } = req;
  const userId = auth.payload.sub;
  const id = req.params.id;
  if (validId(id) === false) {
    return res.status(400).send({ error: "invalid id provided" });
  }
  const reservation = await ReservationModel.findById(id);
  if (reservation === null) {
    return res.status(404).send({ error: "not found" });
  }
  if (userId !== reservation.userId) {
    return res.status(403).send({
      error: "user does not have permission to access this reservation",
    });
  }
  return res.status(200).send(reservation);
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

app.get("*", async (req, res) => {
  return res.status(404).send({ error: "page not found" });
});

app.post(
  "/reservations",
  checkJwt,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      partySize: Joi.number().min(1).required(),
      date: Joi.string().required(),
      restaurantName: Joi.string().min(1).required(),
    }),
  }),
  async (req, res, next) => {
    try {
      const { body, auth } = req;
      const document = {
        userId: auth.payload.sub,
        ...body,
      };
      const reservation = new ReservationModel(document);
      await reservation.save();
      return res.status(201).send(reservation);
    } catch (error) {
      error.status = 400;
      next(error);
    }
  }
);

app.use(errors());

module.exports = app;
