const { MongoClient } = require("mongodb");

const uri =
    "mongodb+srv://bookstore:chi123@cluster0.viplq.mongodb.net/bookstore?retryWrites=true&w=majority";
// Create a new MongoClient
const client = new MongoClient(uri, { useUnifiedTopology: true });

let database;

async function connectDb(){
    await client.connect();
    // Establish and verify connection
    database = await client.db("bookstore");
    console.log('Db connected!');
}

console.log('RUNNING DB...');

connectDb();

const db = () => database;

module.exports.db = db;