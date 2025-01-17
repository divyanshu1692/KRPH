import {MongoClient} from 'mongodb'

const uri = process.env.MONGODB;

let db;
const connectToDatabase = async () => {
    if (db) {
        return db;
    }
    
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log("Connected to database");
        // db = client.db('krph_database');
        db = client.db('krph_db');
        return db;
    } catch (error) {
        console.error("Database connection error:", error);
        throw error; 
    }
};

export default connectToDatabase;
