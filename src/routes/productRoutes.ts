import { Router } from "express";
import { getProductDetails } from "../controllers/productController";

const router = Router();

router.get("/", getProductDetails);

export default router;
