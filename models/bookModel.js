
const {db} = require('../dal/db');
const { ObjectId, Int32} = require('mongodb');

exports.list = async () => {
    console.log('model db');
    const booksCollection = db().collection('books');
    const books = await booksCollection.find({status :Int32(1)}).toArray();
    console.dir(books);
    return books;
}

exports.get = async (id) => {
    const booksCollection = db().collection('books');
    const book = await booksCollection.findOne({_id: ObjectId(id)})
    return book;
}
