const formidable=require('formidable');
const fs= require('fs');

const { ObjectId } = require('mongodb');
const { use } = require('passport');
const userModel = require('../models/userModel');
const nodeMailer = require('nodeMailer');
const { render } = require('../app');
const co = require('co');

exports.signin=(req,res,next) =>
{
    const message = req.query.error;
    res.render('users/signin', {message});
}
exports.signup= async (req,res,next) =>
{
    const users=await userModel.users();
    res.render('users/signup', {users});
}

exports.infor= async (req,res,next) =>
{
    if (req.user)
    {
        const username = req.user.username;
        res.render('users/infor', await userModel.user(username));
    }
    else 
        res.redirect('/users/signin');
}

exports.history=(req,res,next)=>
{
    res.render('users/history');
}

exports.add= async (req,res,next)=>
{
    const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    };
    await userModel.add(newUser);
    res.redirect('/users/signin');
}


exports.updateInfor= async (req,res,next) =>
{
    if (req.user)
    {
        const username = req.user.username;
        res.render('users/updateInfor', await userModel.user(username));
    }
    else 
        res.redirect('/users/signin');
}

exports.postInfor =async (req, res, next) =>
{
    
    const id = req.user._id;
    const obj={$set: {name: req.body.name, address: req.body.address, birthday: req.body.birthday}};
    await userModel.updata(id,obj);
    res.redirect('/users/infor');
    /*
   const form = formidable({multiples: true});
   form.parse(req, (err, fields, files)=>{
       if (err) {
           next(err);
           return;
       }
       var obj={}; 
       const image = files.image;
       if (image && image.size >0)
       {
            const filename= image.path.split("_").pop() + '.'+ image.name.split('.').pop();
            console.log(filename);
            fs.renameSync(image.path, process.env.FILE_IMAGE_USER+'/'+filename);
            obj={$set: {name: fields.name,cover: '/images/users'+filename , address: fields.address, birthday: fields.birthday}};
       }
       else
            obj={$set: {name: fields.name, address: fields.address, birthday: fields.birthday}};
      userModel.updata(req.user._id,obj).then(()=>{res.redirect('users/infor')});
   })
   */
}

exports.moreMoney = async (req, res, next) =>
{
    if (req.user)
    {
        const username = req.user.username;
        res.render('users/moreMoney', await userModel.user(username));
    }
    else 
        res.redirect('users/signin');
}

exports.postBlance =async(req, res, next) =>
{
    const username = req.user.username;
    const user = await userModel.user(username);
    const id = user._id;
    const obj={$set: {blance: req.body.blance}};
    await userModel.updata(id,obj);
    res.redirect('..');
}

exports.history =async(req, res)=>
{
    if (!req.user) 
        res.redirect('/users/signin');
    else{
    const pageNumber = +req.query.page || 1;
    const itemPerPage = +req.query.item || 20;
    const filter={user_id: req.user._id};
    console.log(filter);
    historys = await userModel.findHistorys(filter, pageNumber, itemPerPage);
    historyTotal = await userModel.countHistory(filter);
    res.render('users/history', {historys,
        hasNextPage: itemPerPage*pageNumber < historyTotal,
        hasPrevPage: pageNumber > 1,
        hasPage: (itemPerPage*pageNumber < historyTotal) || pageNumber > 1,
        nextPage: pageNumber+1,
        prevPage: pageNumber-1,
        lastPage: Math.floor((historyTotal+itemPerPage)/itemPerPage),
        itemPerPage,
        pageNumber,
   });
}
}

exports.history_detail =async(req, res)=>
{
    if (req.user)
    {
    var total = 0;
    const cart1 = await userModel.findHistory(req.params.id);
    const cart = new Array();
    if (cart1)
    {
    for (i in cart1.book)
    {
            const t ={};
            t.book = cart1.book[i];
            t.title = cart1.title[i];
            t.basePrice = cart1.basePrice[i];
            t.quantity = cart1.quantity[i];
            t.totalPrice = parseInt(t.basePrice) * parseInt(t.quantity);
            total = total + t.totalPrice;
            cart.push(new Object(t));
    }
    }
    res.render('users/history_detail', {cart, total});
    }
    else
    res.redirect('/users/signin');
}

exports.post = (req, res, next) =>
{
    var transporter =  nodeMailer.createTransport({ // config mail server
        service: 'Gmail',
        auth: {
            user: 'clmnbyltn@gmail.com',
            pass: 'ngocchi123'
        }
    });
    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'Thanh Batmon',
        to: 'buivanngocchi@gmail.com',
        subject: 'Test nodeMailer',
        text: 'You recieved message from ',
        html: '<p>You have got a new message</b><ul><li>Username:'
    }
    console.log("daxd gui");
    transporter.sendMail(mainOptions, function(err, info){
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            console.log('Message sent: ' +  info.response);
            res.redirect('/');
        }
    });
};

exports.rePassword= (req, res) => {
    const message = req.query.error;
    if (!req.user)
        res.redirect('/users/signin');
    res.render('users/rePassword', {message});

}

exports.postPassword = async (req, res) =>
{
    const password = req.body.oldPassword;
    const newUser= {id: req.user._id,
        password: req.body.password};
    if (await userModel.checksPass(password, req.user.password))
    {
        await userModel.rePassword(newUser);
        res.redirect('/');
    }
    else
    {
        res.redirect('/users/rePassword?error=error');
    }
}

