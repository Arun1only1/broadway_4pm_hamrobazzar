import express from "express";
import {
  validateCustomer,
  addCustomer,
  deleteCustomer,
  getCustomerDetails,
  editCustomer,
} from "./customer.service.js";

const router = express.Router();

// create a customer
router.post("/create", validateCustomer, addCustomer);

// delete a customer
router.delete("/delete/:id", deleteCustomer);

// get single customer details
router.get("/details/:id", getCustomerDetails);

// edit user
// id=>params
// =>body
// edit customer
router.put("/edit/:id", validateCustomer, editCustomer);

export default router;
