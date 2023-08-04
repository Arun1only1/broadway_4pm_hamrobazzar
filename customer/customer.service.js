import Joi from "joi";
import { Customer } from "./customer.model.js";

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
