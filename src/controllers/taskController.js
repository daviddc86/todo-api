const taskService = require('../services/taskService');

/**
 * POST /api/tasks
 * Crea una nueva tarea para el usuario autenticado.
 */
const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.user._id, req.body);
    res.status(201).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tasks
 * Lista todas las tareas del usuario autenticado.
 */
const getTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getTasksByUser(req.user._id);
    res.status(200).json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tasks/:id
 * Obtiene una tarea por su ID.
 */
const getTask = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user._id);
    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/tasks/:id
 * Actualiza una tarea existente.
 */
const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.user._id, req.body);
    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/tasks/:id/complete
 * Marca una tarea como completada.
 */
const completeTask = async (req, res, next) => {
  try {
    const task = await taskService.completeTask(req.params.id, req.user._id);
    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/tasks/:id
 * Elimina una tarea.
 */
const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id, req.user._id);
    res.status(200).json({ success: true, message: 'Tarea eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, getTasks, getTask, updateTask, completeTask, deleteTask };
