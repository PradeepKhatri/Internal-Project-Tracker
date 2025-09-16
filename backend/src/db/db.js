
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import sql from 'mssql';

dotenv.config();

// const dbConfig = {
//   server: 'EMRINDGGNIBA\\SQLEXPRESS',
//   database: 'ProjectTrackerDB',
//   user: 'sa',
//   password: 'Gurugram2025',
//   port: 1433,
//   options: {
//     encrypt: false,
//     trustServerCertificate: true
//   }
// };

// const connectAndLog = async () => {
//   try {
//     await sql.connect(dbConfig);
//     console.log("✅ Connection to SQL Server successful!");

//   } catch (err) {
//     console.error("❌ SQL Server connection error:", err);
//   }
// }


const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mssql",
  logging: console.log,
  dialectOptions: {
    options: {
      trustServerCertificate: true,
    }
  }
}
);


const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQL Server connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:');
    if (error.original) {
      console.error('Original error:', error.original);
    }
    console.error(error);
    process.exit(1);
  }
};

export {  sequelize, connectDB };
