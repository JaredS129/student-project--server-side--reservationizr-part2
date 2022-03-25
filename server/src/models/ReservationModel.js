const mongoose = require("mongoose");
const { Schema } = mongoose;

const reservationSchema = new Schema({
  partySize: { type: Number, required: true },
  date: { type: String, required: true },
  restaurantName: { type: String, required: true },
  userId: { type: String, required: true },
});

const Reservation = mongoose.model("Reservation", reservationSchema);

// CITATION:
// Description: transform mongoose schema data directly to get rid of _id and replace with id.
// Title of post: "mongoose "_id" field can't be deleted".
// Date posted: 2015-04-02
// URL: https://stackoverflow.com/questions/29407567/mongoose-id-field-cant-be-deleted

reservationSchema.options.toJSON = {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
};

module.exports = Reservation;
