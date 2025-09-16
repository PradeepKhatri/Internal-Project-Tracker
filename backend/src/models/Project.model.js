import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db.js';

const Project = sequelize.define('Project', {
  projectId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  projectName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  currentStage: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Ideation',
  },
  projectPartner: {
    type: DataTypes.STRING,
  },
  milestoneStartPlanned: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  milestoneStartActual: {
    type: DataTypes.DATE,
  },
  milestoneBrdSignOffPlanned: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  milestoneBrdSignOffActual: {
    type: DataTypes.DATE,
  },
  milestoneDesignApprovalPlanned: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  milestoneDesignApprovalActual: {
    type: DataTypes.DATE,
  },
  milestoneUatSignOffPlanned: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  milestoneUatSignOffActual: {
    type: DataTypes.DATE,
  },
  milestoneDeploymentPlanned: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  milestoneDeploymentActual: {
    type: DataTypes.DATE,
  },
}, {
  timestamps: true,
  tableName: 'Projects',
});

export default Project;