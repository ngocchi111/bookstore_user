
const {db} = require('../dal/db');
const { ObjectId} = require('mongodb');

exports.list = async () => {
    console.log('model db');
    const booksCollection = db().collection('books');
    const books = await booksCollection.find({}).toArray();
    console.dir(books);
    return books;
}

exports.get = async (id) => {
    const booksCollection = db().collection('books');
    const book = await booksCollection.findOne({_id: ObjectId(id)})
    return book;
}
