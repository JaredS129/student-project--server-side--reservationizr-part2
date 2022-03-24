const request = require("supertest");
const app = require("./app");
const RestaurantModel = require("./models/RestaurantModel");

describe("app", () => {
  test("GET /restaurants should respond with a list of restaurants", async () => {
    const expected = [
      {
        id: "616005cae3c8e880c13dc0b9",
        name: "Curry Place",
        description:
          "Bringing you the spirits of India in the form of best authentic grandma's recipe dishes handcrafted with love by our chefs!",
        image: "https://i.ibb.co/yftcRcF/indian.jpg",
      },
      {
        id: "616005e26d59890f8f1e619b",
        name: "Thai Isaan",
        description:
          "We offer guests a modern dining experience featuring the authentic taste of Thailand. Food is prepared fresh from quality ingredients and presented with sophisticated elegance in a stunning dining setting filled with all the richness of Thai colour, sound and art.",
        image: "https://i.ibb.co/HPjd2jR/thai.jpg",
      },
      {
        id: "616bd284bae351bc447ace5b",
        name: "Italian Feast",
        description:
          "From the Italian classics, to our one-of-a-kind delicious Italian favourites, all of our offerings are handcrafted from the finest, freshest ingredients available locally. Whether you're craving Italian comfort food like our Ravioli, Pappardelle or something with a little more Flavour like our famous Fettuccine Carbonara.",
        image: "https://i.ibb.co/0r7ywJg/italian.jpg",
      },
    ];

    await request(app)
      .get("/restaurants")
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(expected);
      });
  });

  test("GET /invalidurl should respond with 404 response", async () => {
    const expected = { error: "page not found" };

    await request(app)
      .get("/invalidurl")
      .expect(404)
      .expect((res) => {
        expect(res.body).toEqual(expected);
      });
  });

  test("GET /restaurants/:id should respond with a single restaurant", async () => {
    const expected = {
      id: "616005e26d59890f8f1e619b",
      name: "Thai Isaan",
      description:
        "We offer guests a modern dining experience featuring the authentic taste of Thailand. Food is prepared fresh from quality ingredients and presented with sophisticated elegance in a stunning dining setting filled with all the richness of Thai colour, sound and art.",
      image: "https://i.ibb.co/HPjd2jR/thai.jpg",
    };

    await request(app)
      .get("/restaurants/616005e26d59890f8f1e619b")
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(expected);
      });
  });

  test("GET /restaurants/:id should respond with 400 error code if id is invalid", async () => {
    const expected = { error: "invalid id provided" };

    await request(app)
      .get("/restaurants/invalidid")
      .expect(400)
      .expect((res) => {
        expect(res.body).toEqual(expected);
      });
  });

  test("GET /restaurants/:id should respond with 404 error code if id does not exist", async () => {
    const expected = { error: "restaurant not found" };

    await request(app)
      .get("/restaurants/616005e26d59890f8f1e619c")
      .expect(404)
      .expect((res) => {
        expect(res.body).toEqual(expected);
      });
  });

  test("POST /reservations creates a new reservation", async () => {
    const expectedStatus = 201;
    const body = {
      partySize: 4,
      date: "2023-11-17T06:30:00.000Z",
      restaurantName: "Island Grill",
    };

    await request(app)
      .post("/reservations")
      .send(body)
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual(expect.objectContaining(body));
        expect(response.body.id).toBeTruthy();
        expect(response.body.userId).toBeTruthy();
      });
  });
});
