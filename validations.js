import { body } from "express-validator";

export const loginValidation = [
  body("email", "Wrong Email add").isEmail(),
  body("password", "Password min length is 5").isLength({ min: 5 }),
];

export const registerValidation = [
  body("email", "Wrong Email add").isEmail(),
  body("password", "Password min length is 5").isLength({ min: 5 }),
  body("fullName", "Full Name min length is 3").isLength({ min: 3 }),
  body("avatarUrl", "Wrong avatar").optional().isURL(),
];

export const postCreateValidation = [
  body("title", "Enter title").isLength({ min: 3 }).isString(),
  body("text", "Enter text").isLength({ min: 10 }).isString(),
  body("tags", "Frong tags format (set array)").optional().isArray(),
  body("imageUrl", "Wrong URL image").optional().isString(),
];

export const commentCreateValidation = [
  body("name", "Enter title").isLength({ min: 3 }).isString(),
  body("photo", "Enter text").isLength({ min: 10 }).isString(),
  body("text", "Enter text").isLength({ min: 10 }).isString(),
];