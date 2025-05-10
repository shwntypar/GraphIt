import express from "express";
import {
  updateUserSchema,
  userSigninSchema,
  userSignupSchema,
} from "../../schema/user.schema";

const userRoutes = express.Router();

export default userRoutes;
