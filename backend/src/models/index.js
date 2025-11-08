const sequelize = require('../config/db');
const User = require('./user');
const Task = require('./task');

// Initialize models
User.initModel(sequelize);
Task.initModel(sequelize);

// Define associations
User.hasMany(Task, { foreignKey: 'user_id', as: 'tasks' });
Task.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = { sequelize, User, Task };