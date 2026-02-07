import Joi from "joi";

/* ===================== COMMON OPTIONS ===================== */
const options = {
  abortEarly: false,     // return all validation errors
  allowUnknown: false,  // block extra fields
  stripUnknown: true,   // remove unknown fields
};

/* ===================== UPDATE PROFILE ===================== */
export const updateProfileSchema = Joi.object(
  {
    name: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .optional()
      .messages({
        "string.min": "First name must be at least 2 characters",
        "string.max": "First name cannot exceed 50 characters",
      }),

    lastname: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .optional()
      .messages({
        "string.min": "Last name must be at least 2 characters",
        "string.max": "Last name cannot exceed 50 characters",
      }),
  },
  options
)
  // At least one field must be provided
  .min(1)
  .messages({
    "object.min": "At least one field (name or lastname) must be updated",
  });
