import Joi from "joi";

/* ===================== COMMON OPTIONS ===================== */
const options = {
  abortEarly: false, // show all errors, not just first
  allowUnknown: false,
  stripUnknown: true,
};

/* ===================== REGISTER VALIDATION ===================== */
export const registerSchema = Joi.object(
  {
    name: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .required()
      .messages({
        "string.empty": "First name is required",
        "string.min": "First name must be at least 2 characters",
      }),

    lastname: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .required()
      .messages({
        "string.empty": "Last name is required",
        "string.min": "Last name must be at least 2 characters",
      }),

    email: Joi.string()
      .trim()
      .lowercase()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.email": "Please enter a valid email address",
        "string.empty": "Email is required",
      }),

    password: Joi.string()
      .min(6)
      .max(30)
      .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d).+$"))
      .required()
      .messages({
        "string.min": "Password must be at least 6 characters",
        "string.pattern.base":
          "Password must contain at least one letter and one number",
        "string.empty": "Password is required",
      }),
  },
  options
);

/* ===================== LOGIN VALIDATION ===================== */
export const loginSchema = Joi.object(
  {
    email: Joi.string()
      .trim()
      .lowercase()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.email": "Invalid email address",
        "string.empty": "Email is required",
      }),

    password: Joi.string()
      .required()
      .messages({
        "string.empty": "Password is required",
      }),
  },
  options
);
