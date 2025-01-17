import connectToDatabase from "../../database/mongoDB";

const dbMiddleware = async (req, res, next) => {
    try {
        req.db = await connectToDatabase();
        next();
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).send('Database connection error');
    }
};


export default dbMiddleware;