const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Model {
    static initModel(sequelize) {
        User.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            name: { type: DataTypes.STRING, allowNull: false },
            email: { type: DataTypes.STRING, allowNull: false, unique: true },
            password_hash: { type: DataTypes.STRING, allowNull: false },
            role: { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' }
        }, {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            underscored: true
        });
    }

    async verifyPassword(password) {
        return bcrypt.compare(password, this.password_hash);
    }

    toJSON() {
        const values = {...this.get() };
        delete values.password_hash;
        return values;
    }
}

module.exports = User;