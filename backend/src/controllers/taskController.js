const { Task } = require('../models');

// ✅ Create a task (only logged-in users)
const createTask = async(req, res) => {
    try {
        const { title, description } = req.body;
        const task = await Task.create({
            title,
            description,
            user_id: req.user.id,
        });
        res.status(201).json({ message: 'Task created successfully', task });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Get logged-in user's tasks
const getTasks = async(req, res, next) => {
    try {
        const tasks = await Task.findAll({
            where: { user_id: req.user.id },
        });
        res.json(tasks);
    } catch (err) {
        next(err);
    }
};

// ✅ Get all tasks (Admin only)
const getAllTasks = async(req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied: Admins only' });
        }
        const tasks = await Task.findAll({ include: 'user' });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Get incomplete tasks (status != 'done')
const getIncompleteTasks = async(req, res, next) => {
    try {
        const tasks = await Task.findAll({
            where: {
                user_id: req.user.id,
                status: ['todo', 'in-progress'], // tasks not done
            },
        });
        res.json(tasks);
    } catch (err) {
        next(err);
    }
};

// ✅ Update task (owner or admin only)
const updateTask = async(req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;

        const task = await Task.findByPk(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        if (task.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        await task.update({
            title: title || task.title,
            description: description || task.description,
            status: status || task.status,
        });

        res.json({ message: 'Task updated successfully', task });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Delete task (owner or admin only)
const deleteTask = async(req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByPk(id);

        if (!task) return res.status(404).json({ error: 'Task not found' });

        if (task.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        await task.destroy();
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createTask,
    getTasks,
    getAllTasks,
    updateTask,
    deleteTask,
    getIncompleteTasks,
};