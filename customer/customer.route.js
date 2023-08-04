import express from "express";
import {
  validateCustomer,
  addCustomer,
  deleteCustomer,
  getCustomerDetails,
} from "./customer.service.js";

const router = express.Router();

// create a customer
router.post("/customer/create", validateCustomer, addCustomer);

// delete a customer
router.delete("/customer/delete/:id", deleteCustomer);

// get single customer details
router.get("/customer/details/:id", getCustomerDetails);

export default router;
