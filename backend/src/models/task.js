const { DataTypes, Model } = require('sequelize');

class Task extends Model {
    static initModel(sequelize) {
        Task.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            title: { type: DataTypes.STRING, allowNull: false },
            description: { type: DataTypes.TEXT, allowNull: true },
            status: {
                type: DataTypes.ENUM('todo', 'in-progress', 'done'),
                defaultValue: 'todo'
            }
        }, {
            sequelize,
            modelName: 'Task',
            tableName: 'tasks',
            underscored: true
        });
    }
}

module.exports = Task;