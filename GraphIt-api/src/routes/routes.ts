import { Router } from "express";
import userRoutes from "../controllers/users/userRoutes";

export const routes: Router[] = [userRoutes] as const;

export type AppRoutes = (typeof routes)[number];
