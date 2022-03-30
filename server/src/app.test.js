const request = require("supertest");
const app = require("./app");

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

  test("POST /reservations returns bad request if partySize is less than 1", async () => {
    const expectedStatus = 400;
    const body = {
      partySize: 0,
      date: "2023-11-17T06:30:00.000Z",
      restaurantName: "Island Grill",
    };
    const expected = {
      error: "Bad Request",
      statusCode: 400,
      message: "Validation failed",
      validation: {
        body: {
          source: "body",
          keys: ["partySize"],
          message: '"partySize" must be greater than or equal to 1',
        },
      },
    };

    await request(app)
      .post("/reservations")
      .send(body)
      .expect(expectedStatus)
      .expect((res) => {
        expect(res.body).toEqual(expected);
      });
  });

  test("POST /reservations returns bad request if date is empty", async () => {
    const expectedStatus = 400;
    const body = {
      partySize: 1,
      date: "",
      restaurantName: "Island Grill",
    };
    const expected = {
      statusCode: 400,
      error: "Bad Request",
      message: "Validation failed",
      validation: {
        body: {
          source: "body",
          keys: ["date"],
          message: '"date" is not allowed to be empty',
        },
      },
    };

    await request(app)
      .post("/reservations")
      .send(body)
      .expect(expectedStatus)
      .expect((res) => {
        expect(res.body).toEqual(expected);
      });
  });

  test("POST /reservations returns bad request if restaurantName is empty", async () => {
    const expectedStatus = 400;
    const body = {
      partySize: 1,
      date: "2023-11-17T06:30:00.000Z",
      restaurantName: "",
    };
    const expected = {
      statusCode: 400,
      error: "Bad Request",
      message: "Validation failed",
      validation: {
        body: {
          source: "body",
          keys: ["restaurantName"],
          message: '"restaurantName" is not allowed to be empty',
        },
      },
    };

    await request(app)
      .post("/reservations")
      .send(body)
      .expect(expectedStatus)
      .expect((res) => {
        expect(res.body).toEqual(expected);
      });
  });

  test("POST /reservations returns bad request if user includes an invalid object key", async () => {
    const expectedStatus = 400;
    const body = {
      partySize: 4,
      date: "2023-11-17T06:30:00.000Z",
      restaurantName: "Island Grill",
      newKey: "newProp",
    };
    const expected = {
      statusCode: 400,
      error: "Bad Request",
      message: "Validation failed",
      validation: {
        body: {
          source: "body",
          keys: ["newKey"],
          message: '"newKey" is not allowed',
        },
      },
    };

    await request(app)
      .post("/reservations")
      .send(body)
      .expect(expectedStatus)
      .expect((res) => {
        expect(res.body).toEqual(expected);
      });
  });

  test("POST /reservations returns bad request if restaurantName is missing", async () => {
    const expectedStatus = 400;
    const body = {
      partySize: 4,
      date: "2023-11-17T06:30:00.000Z",
    };
    const expected = {
      statusCode: 400,
      error: "Bad Request",
      message: "Validation failed",
      validation: {
        body: {
          source: "body",
          keys: ["restaurantName"],
          message: '"restaurantName" is required',
        },
      },
    };

    await request(app)
      .post("/reservations")
      .send(body)
      .expect(expectedStatus)
      .expect((res) => {
        expect(res.body).toEqual(expected);
      });
  });

  test("POST /reservations returns bad request if date is missing", async () => {
    const expectedStatus = 400;
    const body = {
      partySize: 4,
      restaurantName: "Island Grill",
    };
    const expected = {
      statusCode: 400,
      error: "Bad Request",
      message: "Validation failed",
      validation: {
        body: {
          source: "body",
          keys: ["date"],
          message: '"date" is required',
        },
      },
    };

    await request(app)
      .post("/reservations")
      .send(body)
      .expect(expectedStatus)
      .expect((res) => {
        expect(res.body).toEqual(expected);
      });
  });

  test("POST /reservations returns bad request if partySize is missing", async () => {
    const expectedStatus = 400;
    const body = {
      date: "2023-11-17T06:30:00.000Z",
      restaurantName: "Island Grill",
    };
    const expected = {
      statusCode: 400,
      error: "Bad Request",
      message: "Validation failed",
      validation: {
        body: {
          source: "body",
          keys: ["partySize"],
          message: '"partySize" is required',
        },
      },
    };

    await request(app)
      .post("/reservations")
      .send(body)
      .expect(expectedStatus)
      .expect((res) => {
        expect(res.body).toEqual(expected);
      });
  });

  test("POST /reservations returns bad request if partySize is not a number", async () => {
    const expectedStatus = 400;
    const body = {
      partySize: "string",
      date: "2023-11-17T06:30:00.000Z",
      restaurantName: "Island Grill",
    };
    const expected = {
      statusCode: 400,
      error: "Bad Request",
      message: "Validation failed",
      validation: {
        body: {
          source: "body",
          keys: ["partySize"],
          message: '"partySize" must be a number',
        },
      },
    };

    await request(app)
      .post("/reservations")
      .send(body)
      .expect(expectedStatus)
      .expect((res) => {
        expect(res.body).toEqual(expected);
      });
  });

  test("POST /reservations returns bad request if date is not a string", async () => {
    const expectedStatus = 400;
    const body = {
      partySize: 4,
      date: 100,
      restaurantName: "Island Grill",
    };
    const expected = {
      statusCode: 400,
      error: "Bad Request",
      message: "Validation failed",
      validation: {
        body: {
          source: "body",
          keys: ["date"],
          message: '"date" must be a string',
        },
      },
    };

    await request(app)
      .post("/reservations")
      .send(body)
      .expect(expectedStatus)
      .expect((res) => {
        expect(res.body).toEqual(expected);
      });
  });

  test("POST /reservations returns bad request if restaurantName is not a string", async () => {
    const expectedStatus = 400;
    const body = {
      partySize: 4,
      date: "2023-11-17T06:30:00.000Z",
      restaurantName: 100,
    };
    const expected = {
      statusCode: 400,
      error: "Bad Request",
      message: "Validation failed",
      validation: {
        body: {
          source: "body",
          keys: ["restaurantName"],
          message: '"restaurantName" must be a string',
        },
      },
    };

    await request(app)
      .post("/reservations")
      .send(body)
      .expect(expectedStatus)
      .expect((res) => {
        expect(res.body).toEqual(expected);
      });
  });

  it("should return 404 with error message if endpoint being posted to does not exist", async () => {
    const expectedStatus = 404;
    const body = {
      partySize: 1,
      date: "2023-11-17T06:30:00.000Z",
      restaurantName: "Island Grill",
    };
    const expected = {
      error: "endpoint not found",
    };

    await request(app)
      .post("/*")
      .send(body)
      .expect(expectedStatus)
      .expect((res) => {
        expect(res.body).toEqual(expected);
      });
  });

  test("GET /reservations should respond with a list of reservations created by the current user", async () => {
    const expected = [
      {
        id: "507f1f77bcf86cd799439011",
        partySize: 4,
        date: "2023-11-17T06:30:00.000Z",
        userId: "mock-user-id",
        restaurantName: "Island Grill",
      },
      {
        id: "614abf0a93e8e80ace792ac6",
        partySize: 2,
        date: "2023-12-03T07:00:00.000Z",
        userId: "mock-user-id",
        restaurantName: "Green Curry",
      },
    ];

    await request(app)
      .get("/reservations")
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(expected);
      });
  });

  test("GET /reservations/:id should respond with a single reservation", async () => {
    const expected = {
      id: "614abf0a93e8e80ace792ac6",
      partySize: 2,
      date: "2023-12-03T07:00:00.000Z",
      userId: "mock-user-id",
      restaurantName: "Green Curry",
    };

    await request(app)
      .get("/reservations/614abf0a93e8e80ace792ac6")
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(expected);
      });
  });

  test("GET /reservations/:id should respond with 400 error code if id is invalid", async () => {
    const expected = { error: "invalid id provided" };

    await request(app)
      .get("/reservations/invalidid")
      .expect(400)
      .expect((res) => {
        expect(res.body).toEqual(expected);
      });
  });

  test("GET /reservations/:id should respond with 404 error code if id does not exist", async () => {
    const expected = { error: "not found" };

    await request(app)
      .get("/reservations/614abf0a93e8e80ace792ac7")
      .expect(404)
      .expect((res) => {
        expect(res.body).toEqual(expected);
      });
  });

  test("GET /reservations/:id should respond with 403 error code if the user is trying to access an id they did not create", async () => {
    const expected = {
      error: "user does not have permission to access this reservation",
    };

    await request(app)
      .get("/reservations/61679189b54f48aa6599a7fd")
      .expect(403)
      .expect((res) => {
        expect(res.body).toEqual(expected);
      });
  });
});
