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
})