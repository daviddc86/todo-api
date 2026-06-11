const Task = require('../models/Task');

/**
 * Crea una nueva tarea asociada al usuario.
 */
const createTask = async (userId, data) => {
  return await Task.create({ ...data, user: userId });
};

/**
 * Devuelve todas las tareas del usuario autenticado.
 */
const getTasksByUser = async (userId) => {
  return await Task.find({ user: userId }).sort({ createdAt: -1 });
};

/**
 * Devuelve una tarea por ID, verificando que pertenece al usuario.
 */
const getTaskById = async (taskId, userId) => {
  const task = await Task.findById(taskId);

  if (!task) {
    const error = new Error('Tarea no encontrada');
    error.statusCode = 404;
    throw error;
  }

  if (task.user.toString() !== userId.toString()) {
    const error = new Error('No tienes permiso para acceder a esta tarea');
    error.statusCode = 403;
    throw error;
  }

  return task;
};

/**
 * Actualiza una tarea. Verifica propiedad del usuario.
 */
const updateTask = async (taskId, userId, data) => {
  const task = await getTaskById(taskId, userId);
  Object.assign(task, data);
  return await task.save();
};

/**
 * Marca una tarea como completada.
 */
const completeTask = async (taskId, userId) => {
  const task = await getTaskById(taskId, userId);
  task.completed = true;
  return await task.save();
};

/**
 * Elimina una tarea. Verifica propiedad del usuario.
 */
const deleteTask = async (taskId, userId) => {
  const task = await getTaskById(taskId, userId);
  await task.deleteOne();
};

module.exports = {
  createTask,
  getTasksByUser,
  getTaskById,
  updateTask,
  completeTask,
  deleteTask,
};
