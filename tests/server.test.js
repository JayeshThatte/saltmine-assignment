const session = require("supertest-session");
const app = require("../server");


describe("Shopping Cart API Tests", () => {
  let testSession;

  beforeEach(() => {
    testSession = session(app);
  });

  test("Should add a valid product to the cart", async () => {

    const res = await testSession.post("/cart/add").send({
      productName: "weetabix",
      quantity: 2,
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Product added to cart");
    expect(res.body.cart).toEqual([
      { productName: "weetabix", quantity: 2, total: 19.96 },
    ]);
  });

  test("Should not add a invalid product name to the cart", async () => {

    const res = await testSession.post("/cart/add").send({
      productName: "weetbix",
      quantity: 2,
    });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Invalid product name");
    expect(res.body.cart).toEqual([
    ]);
  });

  test("Should not add a invalid product quantity to the cart", async () => {

    const res = await testSession.post("/cart/add").send({
      productName: "weetabix",
      quantity: 2.7,
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid product quantity");
    expect(res.body.cart).toEqual([
    ]);
  });

  test("Should get valid cart state", async () => {

    let res = await testSession.post("/cart/add").send({
      productName: "cornflakes",
      quantity: 2,
    });

    res = await testSession.post("/cart/add").send({
      productName: "weetabix",
      quantity: 1,
    });

    let cart_state = await testSession.get("/cart")

    expect(cart_state.status).toBe(200);
    expect(cart_state.body.subtotal).toEqual(15.02);
    expect(cart_state.body.tax).toEqual(1.88);
    expect(cart_state.body.total).toEqual(16.9);
    expect(res.body.cart).toEqual([
        {
          "productName": "cornflakes",
          "quantity": 2,
          "total": 5.04
        },
        {
          "productName": "weetabix",
          "quantity": 1,
          "total": 9.98
        }
      ]);
  });

})