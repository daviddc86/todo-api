const { body, validationResult } = require('express-validator');

/**
 * Reglas de validación para crear/editar tareas.
 */
const taskValidators = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('El título es obligatorio'),
  body('responsible')
    .trim()
    .notEmpty()
    .withMessage('El responsable es obligatorio'),
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

module.exports = { taskValidators, validate };
