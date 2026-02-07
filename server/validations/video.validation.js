import Joi from "joi";
import { VIDEO_CATEGORIES, LEVELS } from "../utils/constants.js";

/* ===================== COMMON OPTIONS ===================== */
const options = {
  abortEarly: false,     // return all validation errors
  allowUnknown: false,  // block extra fields
  stripUnknown: true,   // remove unknown fields automatically
};

/* ===================== VIDEO VALIDATION ===================== */
export const videoSchema = Joi.object(
  {
    title: Joi.string()
      .trim()
      .min(3)
      .max(120)
      .required()
      .messages({
        "string.empty": "Video title is required",
        "string.min": "Title must be at least 3 characters",
      }),

    description: Joi.string()
      .trim()
      .max(1000)
      .allow("")
      .messages({
        "string.max": "Description cannot exceed 1000 characters",
      }),

    category: Joi.string()
      .lowercase()
      .valid(...VIDEO_CATEGORIES)
      .required()
      .messages({
        "any.only": "Invalid video category",
        "string.empty": "Category is required",
      }),

    genre: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .required()
      .messages({
        "string.empty": "Genre is required",
      }),

    level: Joi.string()
      .lowercase()
      .valid(...LEVELS)
      .required()
      .messages({
        "any.only": "Invalid skill level",
        "string.empty": "Level is required",
      }),

    video_url: Joi.string()
      .uri()
      .optional()
      .messages({
        "string.uri": "Video URL must be a valid URL",
      }),
  },
  options
);
