import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db.js';

const User = sequelize.define('User', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'viewer',
    validate: {
      isIn: [['viewer', 'admin', 'superadmin']],
    },
  },
}, {
  timestamps: true,
  tableName: 'Users',
});

User.associate = (models) => {
  User.hasMany(models.Project, {
    foreignKey: 'projectManagerId',
    as: 'managedProjects',
  });
};

export default User;
