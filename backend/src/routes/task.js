const express = require('express');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    getAllTasks,
    getIncompleteTasks,
} = require('../controllers/taskController');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management routes
 */

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Get all tasks for the logged-in user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's tasks
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, getTasks);

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: Complete Backend Assignment
 *               description:
 *                 type: string
 *                 example: Finish all Swagger and Postman integration
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
    '/',
    authenticate, [
        body('title').notEmpty().withMessage('Title is required'),
        body('description').notEmpty().withMessage('Description is required'),
    ],
    validate,
    createTask
);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   put:
 *     summary: Update an existing task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Task Title
 *               description:
 *                 type: string
 *                 example: Updated task description
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 */
router.put('/:id', authenticate, updateTask);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
router.delete('/:id', authenticate, deleteTask);

/**
 * @swagger
 * /api/v1/tasks/incomplete:
 *   get:
 *     summary: Get all incomplete tasks for the logged-in user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of incomplete tasks
 *       401:
 *         description: Unauthorized
 */
router.get('/incomplete', authenticate, getIncompleteTasks);

/**
 * @swagger
 * /api/v1/tasks/all:
 *   get:
 *     summary: Get all tasks (Admin only)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all tasks (Admin access)
 *       403:
 *         description: Forbidden (not admin)
 */
router.get('/all', authenticate, authorizeAdmin, getAllTasks);

module.exports = router;