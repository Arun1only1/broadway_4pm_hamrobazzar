import express from "express";
import Joi from "joi";
import { Product } from "./product.model.js";
const router = express.Router();

router.post(
  "/product/create",
  async (req, res, next) => {
    //    validate product body
    const schema = Joi.object({
      name: Joi.string().min(3).max(55).required(),
      price: Joi.number().min(0).required(),
      customerId: Joi.string(),
    });

    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },
  async (req, res) => {
    const newProduct = req.body;

    await Product.create(newProduct);

    return res.status(201).send({ message: "Product added" });
  }
);

export default router;
