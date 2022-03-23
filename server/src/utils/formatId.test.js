const formatId = require("./formatId");

const idFromMongoose = {
  _id: "616005cae3c8e880c13dc0b9",
  placeholderProp: "lorem ipsum",
  placeholderProp2: "lorem ipsum",
};

describe("formatId", () => {
  it("should format '_id' property to 'id' for any database entry", async () => {
    const expected = {
      id: "616005cae3c8e880c13dc0b9",
      placeholderProp: "lorem ipsum",
      placeholderProp2: "lorem ipsum",
    };
    const recieved = formatId(idFromMongoose);
    expected(recieved).toEqual(expected);
  });
});
