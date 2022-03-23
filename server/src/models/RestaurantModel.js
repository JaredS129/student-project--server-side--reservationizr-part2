const mongoose = require("mongoose");
const { Schema } = mongoose;

const restaurantSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  Image: { type: String, required: true },
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

// CITATION:
// Description: transform mongoose schema data directly to get rid of _id and replace with id.
// Title of post: "mongoose "_id" field can't be deleted".
// Date posted: 2015-04-02
// URL: https://stackoverflow.com/questions/29407567/mongoose-id-field-cant-be-deleted

restaurantSchema.options.toJSON = {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
};

module.exports = Restaurant;
