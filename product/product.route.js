import express from "express";
import {
  addProduct,
  validateProduct,
  getProductDetails,
} from "./product.service.js";

const router = express.Router();

// add product
router.post("/product/create", validateProduct, addProduct);

// get product
router.get("/product/details/:id", getProductDetails);

export default router;
