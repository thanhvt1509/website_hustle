import express from "express";
import {
  create,
  createOrderByAdmin,
  deleteOrderByAdmin,
  get,
  getAll,
  update,
} from "../controllers/order.js";
const router = express.Router();

router.get("/", getAll),
  router.post("/admin/add", createOrderByAdmin),
  router.get("/:id", get),
  router.post("/add", create),
  router.patch("/:id", update);
  router.delete("/:id", deleteOrderByAdmin);


export default router;
