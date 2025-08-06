import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URL);

        console.log("Database Connected Successfully!", connectionInstance.connection.host)
        
    } catch (error) {

        console.log("MongoDB connection Failed! ", error)
        process.exit(1);
        
    }
    
}

