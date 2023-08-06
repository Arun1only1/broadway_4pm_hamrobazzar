import express from "express";
import { db_connect } from "./db_connect.js";
import customerRoutes from "./customer/customer.route.js";
import productRoutes from "./product/product.route.js";

const app = express();
app.use(express.json());

// connect db
db_connect();

// register routes
app.use("/customer", customerRoutes);
app.use(productRoutes);

const port = process.env.PORT;

app.listen(port, () => {
  console.log("App is listening on port", port);
});
