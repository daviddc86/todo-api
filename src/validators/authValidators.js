const { body, validationResult } = require('express-validator');

/**
 * Reglas de validación para el registro de usuario.
 */
const registerValidators = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio'),
  body('email')
    .isEmail()
    .withMessage('Introduce un email válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
];

/**
 * Reglas de validación para el login.
 */
const loginValidators = [
  body('email')
    .isEmail()
    .withMessage('Introduce un email válido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria'),
];

/**
 * Middleware que comprueba los errores de validación y devuelve 400 si hay alguno.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { registerValidators, loginValidators, validate };
