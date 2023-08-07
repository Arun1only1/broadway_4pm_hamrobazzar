import Joi from "joi";
import { Product } from "./product.model.js";
import {
  checkMongoIdValidity,
  convertStringToMongoId,
} from "../utils/utils.js";
import mongoose from "mongoose";

export const validateProduct = async (req, res, next) => {
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
};

export const addProduct = async (req, res) => {
  const newProduct = req.body;

  await Product.create(newProduct);

  return res.status(201).send({ message: "Product added" });
};

// get product details
export const getProductDetails = async (req, res) => {
  // extract id from params
  const productId = req.params.id;
  console.log(productId);

  // validate id
  const isValid = checkMongoIdValidity(productId);

  // if error, throw error
  if (!isValid) {
    return res.status(400).send({ message: "Invalid mongo id." });
  }

  // find product

  const product = await Product.aggregate([
    {
      $match: {
        _id: convertStringToMongoId(productId),
      },
    },
    {
      $lookup: {
        from: "customers",
        localField: "customerId",
        foreignField: "_id",
        as: "customerData",
      },
    },
    {
      $project: {
        name: 1,
        price: 1,

        customerDetails: {
          name: { $first: "$customerData.name" },
          email: { $first: "$customerData.email" },
        },
      },
    },
  ]);

  // if not product, throw error
  if (product.length === 0) {
    return res.status(404).send({ message: "Product does not exist." });
  }

  // send product in response
  return res.status(200).send(product[0]);
};
