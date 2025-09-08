import path from "path";
import multer from "multer";
import Project from "../models/Project.model";

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 16 * 1024 * 1024 } // 16 MB limit
});

export default upload