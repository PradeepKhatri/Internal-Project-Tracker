import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db.js';

const ProjectFile = sequelize.define('ProjectFile', {
  fileId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contentType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileData: {
    type: DataTypes.BLOB('long'), // For VARBINARY(MAX)
    allowNull: false,
  },
  // The 'projectId' foreign key will be added via associations.
}, {
  timestamps: false, // Usually, we don't need timestamps for file records
  tableName: 'ProjectFiles',
});

export default ProjectFile;