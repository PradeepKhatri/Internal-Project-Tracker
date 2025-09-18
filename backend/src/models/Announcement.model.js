import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";

const Announcement = sequelize.define(
  "Announcement",
  {
    announcementId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "Announcements",
    timestamps: true,
  }
);

export default Announcement;
