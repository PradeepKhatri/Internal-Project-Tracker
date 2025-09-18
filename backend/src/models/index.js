import { sequelize } from '../db/db.js';
import User from './User.model.js';
import Project from './Project.model.js';
import ProjectFile from './ProjectFile.model.js';
import Announcement from './Announcement.model.js';

// 1. Define relationship between User and Project
// A User (as a Project Manager) can have many Projects
User.hasMany(Project, {
  foreignKey: 'projectManagerId', // This adds projectManagerId to the Project model
  as: 'managedProjects',
});
// A Project belongs to one User (as its Project Manager)
Project.belongsTo(User, {
  foreignKey: 'projectManagerId',
  as: 'projectManager',
});


// 2. Define relationship between Project and ProjectFile
// A Project can have many files
Project.hasMany(ProjectFile, {
  foreignKey: 'projectId', // This adds projectId to the ProjectFile model
  as: 'files',
});
// A ProjectFile belongs to one Project
ProjectFile.belongsTo(Project, {
  foreignKey: 'projectId',
});


// Export everything for use in other parts of the app
export { sequelize, User, Project, ProjectFile, Announcement };
