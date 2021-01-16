const {db} = require('../dal/db');
const { ObjectId, Int32} = require('mongodb');
const { authenticate } = require('passport');

exports.list = async (filter, pageNumber, itemPerPage) => {
    const booksCollection = db().collection('books');
    const books = await booksCollection.find(filter).limit(itemPerPage).skip(itemPerPage*(pageNumber-1)).toArray();
    return books;
}

exports.count= async (filter) =>{
    const booksCollection = db().collection('books');
    const count = await booksCollection.count(filter);
    return count;
}

exports.get = async (id) => {
    const booksCollection = db().collection('books');
    const book = await booksCollection.findOne({_id: ObjectId(id)})
    return book;
}

exports.authors= async () =>
{
    const authorsCollection = db().collection('authors');
    const authors = await authorsCollection.find().toArray();
    return authors;
}

exports.catalogs= async () =>
{
    const catalogsCollection = db().collection('catalogs');
    const catalogs = await catalogsCollection.find().toArray();
    return catalogs;
}

exports.addAuthors= async (obj) =>
{
    const authorsCollection = db().collection('authors');
    await authorsCollection.insertOne(obj);
    return true;
}

exports.addCatalogs= async (obj) =>
{
    const catalogsCollection = db().collection('catalogs');
    await catalogsCollection.insertOne(obj);
    return true;
}

exports.findAuthors= async (filter) =>
{
    const authorsCollection = db().collection('authors');
    const t = await authorsCollection.findOne(filter);
    return t;
}

exports.findCatalogs= async (filter) =>
{
    const catalogsCollection = db().collection('catalogs');
    const t = await catalogsCollection.findOne(filter);
    return t;
}
