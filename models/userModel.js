const {db} = require('../dal/db');
const { ObjectId, Int32} = require('mongodb');
const bcrypt = require('bcrypt');
const { history } = require('../controllers/userController');

exports.user = async (Username) =>
{
    const userCollection = db().collection('users');
    const user = await userCollection.findOne({username: Username});
    return user;
}

exports.users = async () =>
{
    const userCollection = db().collection('users');
    const users = await userCollection.find().toArray();
    return users;
}

exports.add = async (newUser) =>
{
    const userCollection = db().collection('users');
    const saltRounds = 10;
    await bcrypt.genSalt(saltRounds, function(err, salt){
        bcrypt.hash(newUser.password, salt , function (err, hash) {
        const user = {
            username: newUser.username,
            password: hash,
            email: newUser.email,
            status: 'active',
            blance: 0,
        }
        userCollection.insertOne(user);
        });
    })
    return userCollection;
}

exports.rePassword = async (newUser) =>
{
    const userCollection = db().collection('users');
    const saltRounds = 10;
    await bcrypt.genSalt(saltRounds, function(err, salt){
        bcrypt.hash(newUser.password, salt , function (err, hash) {
        const user = {$set: {
            password: hash}
        }
        userCollection.updateOne({_id: ObjectId(newUser.id)},user);
        });
    })
    return userCollection;
}

exports.checkSignin=async (Username, Password)=>
{
    const userCollection = db().collection('users');
    const user = await userCollection.findOne({username: Username});
    if (!user)
        return false;
    let checkPassword= await bcrypt.compare(Password, user.password);
    if (checkPassword && (String(user.status)=="active"))
    {
        console.log('username: ',user.username);
        return user;
    }
    return false;
}

exports.checksPass=async (password, Password)=>
{
    let checkPassword= await bcrypt.compare(password, Password);
    if (checkPassword)
    {
        return true;
    }
    return false;
}


exports.getUser= (id) =>{
    const userCollection = db().collection('users');
    return userCollection.findOne({_id: ObjectId(id)});
}

exports.updata=async(id,obj)=>{
    const usersCollection = db().collection('users');
    const old ={_id :ObjectId(id)};
    await usersCollection.updateOne(old,obj);
    return true;
}

exports.addHistory=async(filter)=>
{
    const historysCollection = db().collection('historys');
    await historysCollection.insertOne(filter);
    return true;
}

exports.findHistorys = async (filter, pageNumber, itemPerPage) => {
    const historysCollection = db().collection('historys');
    const historys = await historysCollection.find(filter).limit(itemPerPage).skip(itemPerPage*(pageNumber-1)).toArray();
    return historys;
}

exports.findHistory = async (id) => {
    const hitorysCollection = db().collection('historys');
    const hitory = await hitorysCollection.findOne({_id: ObjectId(id)});
    return hitory;
}

exports.countHistory = async(filter)=>
{
    const historysCollection = db().collection('historys');
    const count = await historysCollection.count(filter);
    return count;
}
