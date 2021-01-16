const {db} = require('../dal/db');
const { ObjectId, Int32} = require('mongodb');


exports.addCmt=async(obj)=>{
    const cmtCollection = db().collection('cmt');
    await cmtCollection.insertOne(obj);
    return cmtCollection;
}

exports.comments=async(id, pageNumber, itemPerPage)=>{
    const cmtCollection = db().collection('cmt');
    const cmts = await cmtCollection.find({id_book: id}).limit(itemPerPage).skip(itemPerPage*(pageNumber-1)).toArray();
    return cmts;
}

exports.count = async(id)=>
{
    const cmtCollection = db().collection('cmt');
    const count = await cmtCollection.count({id_book: id});
    return count;
}