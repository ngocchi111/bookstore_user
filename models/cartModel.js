const {db} = require('../dal/db');
const { ObjectId, Int32} = require('mongodb');

exports.findCart= async (filter) =>
{
    const cartCollection = db().collection('carts');
    const t = await cartCollection.findOne(filter);
    return t;
}

exports.deleteCart = async (id) =>
{
    const cartCollection = db().collection('carts');
    const old ={_id :ObjectId(id)};
    await cartCollection.deleteOne(old);
    return true;
}

exports.addCart = async (filter) =>
{
    const cartCollection = db().collection('carts');
    await cartCollection.insertOne(filter);
    return true;
}