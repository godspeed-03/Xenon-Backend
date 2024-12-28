import { Router } from "express";
import { getProperty } from "../controllers/Property.controller.js";

const propertyRouter = Router();

propertyRouter.route("/properties").get(getProperty);

export default propertyRouter;
