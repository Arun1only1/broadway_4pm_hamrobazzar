import Joi from "joi";
import { Customer } from "./customer.model.js";
import {
  checkMongoIdValidity,
  convertStringToMongoId,
} from "../utils/utils.js";

// validation logic of customer
export const validateCustomer = async (req, res, next) => {
  const newCustomer = req.body;

  const schema = Joi.object({
    name: Joi.string().min(3).max(55).required().trim(),
    dob: Joi.string().required().trim(),
    gender: Joi.string()
      .required()
      .valid("male", "female", "preferNotToSay")
      .trim(),
    email: Joi.string().email().required().trim(),
  });

  try {
    await schema.validateAsync(newCustomer);
    next();
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

// add customer logic
export const addCustomer = async (req, res, next) => {
  const newCustomer = req.body;

  //   check if user exists
  const customer = await Customer.findOne({ email: newCustomer.email });

  if (customer) {
    return res
      .status(409)
      .send({ message: "User with this email already exists." });
  }

  try {
    await Customer.create(newCustomer);
    return res.status(201).send({ message: "Customer created." });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// delete customer
export const deleteCustomer = async (req, res) => {
  // extract id
  const customerId = req.params.id;

  // validate id
  const isValidMongoId = checkMongoIdValidity(customerId);

  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid mongoId" });
  }

  // delete customer
  await Customer.deleteOne({ _id: customerId });

  // send response
  return res.status(200).send({ message: "Customer deleted successfully." });
};

// get customer details by Id
export const getCustomerDetails = async (req, res) => {
  // extract id
  const customerId = req.params.id;

  // validate id
  const isValidId = checkMongoIdValidity(customerId);

  if (!isValidId) {
    return res.status(400).send({ message: "Invalid mongo id" });
  }

  // find user
  // const customer = await Customer.findById(customerId);
  const customer = await Customer.aggregate([
    {
      $match: {
        _id: convertStringToMongoId(customerId),
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "customerId",
        as: "productData",
      },
    },
    {
      $project: {
        name: 1,
        email: 1,
        "productData.name": 1,
        "productData.price": 1,
      },
    },
  ]);

  // if not user throw error
  if (customer.length === 0) {
    return res.status(404).send({ message: "Customer does not exist." });
  }

  // send customer as response
  return res.status(200).send(customer[0]);
};

// edit customer
export const editCustomer = async (req, res) => {
  // extract id
  const customerId = req.params.id;

  // validate id
  const isValid = checkMongoIdValidity(customerId);

  // if not valid, throw error
  if (!isValid) {
    return res.status(400).send({ message: "Invalid mongo id." });
  }

  // check customer with id exists or not
  const customer = await Customer.findOne({ _id: customerId });

  // if not customer, throw error
  if (!customer) {
    return res.status(404).send({ message: "Customer does not exist." });
  }

  // edit customer
  const newCustomer = req.body;

  await Customer.updateOne(
    { _id: customerId },
    {
      $set: {
        name: newCustomer.name,
        dob: newCustomer.dob,
        email: newCustomer.email,
        gender: newCustomer.gender,
      },
    }
  );

  // send appropriate response
  return res.status(200).send({ message: "Customer updated successfully." });
};

// search  customer by name
export const searchCustomerByName = async (req, res) => {
  const nameToBeSearched = req.body.name;

  const customers = await Customer.find({
    name: { $regex: nameToBeSearched, $options: "i" },
  });

  return res.status(200).send(customers);
};
