// Define validation schema
import Joi from "joi";
export const BlogSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title cannot exceed 100 characters',
      'any.required': 'Title is required'
    }),
    
  description: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description cannot exceed 500 characters',
      'any.required': 'Description is required'
    }),
    
  content: Joi.string()
    .min(50)
    .required()
    .messages({
      'string.min': 'Content must be at least 50 characters long',
      'any.required': 'Content is required'
    }),
    
  image: Joi.object({
    imagePath: Joi.string()
      .pattern(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)
      .required()
      .messages({
        'string.pattern.base': 'Image path must be a valid URL pointing to an image file'
      }),
    image_id: Joi.string().allow(null, '').optional()
  }).optional().messages({
    'object.base': 'Image must be an object with valid properties'
  }),
    
  author: Joi.string()
    .required()
    .messages({
      'any.required': 'Author is required'
    }),
    
  date: Joi.date()
    .default(Date.now)
    .messages({
      'date.base': 'Date must be a valid date'
    }),
    
  tags: Joi.array()
    .items(Joi.string().min(2).max(20))
    .min(1)
    .max(10)
    .messages({
      'array.min': 'At least one tag is required',
      'array.max': 'Cannot have more than 10 tags',
      'string.min': 'Tag must be at least 2 characters long',
      'string.max': 'Tag cannot exceed 20 characters'
    }),
    
  isPremium: Joi.boolean()
    .required()
    .messages({
      'any.required': 'Premium status must be specified'
    }),
  _id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null, '')
    .optional()
    .messages({
      'string.pattern.base': 'Blog ID must be a valid MongoDB ObjectId'
    })
});
