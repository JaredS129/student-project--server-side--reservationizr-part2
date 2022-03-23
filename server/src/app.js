const express = require("express");
const cors = require("cors");
const app = express();
const Restaurant = require("./models/RestaurantModel")

app.use(cors());
app.use(express.json());



module.exports = app;
