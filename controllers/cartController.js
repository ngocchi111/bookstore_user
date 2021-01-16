const { ObjectId } = require('mongodb');
const { render } = require('../app');
const bookModel = require('../models/bookModel');
const cartModel = require('../models/cartModel');
const userModel = require('../models/userModel');
const { param } = require('../routes/users');
const { history } = require('./userController');

exports.update= async (req, res)=>
{
    const ip=  req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const filter1 = {
        ip: new RegExp(ip, 'i'),
    }
    const filter = {
        ip: ip,
        book: [],
        basePrice: [],
        quantity: [],
        title: [],
    }
    const cart = await cartModel.findCart(filter1);
    if (cart)
    {
    filter.book=cart.book;
    filter.basePrice=cart.basePrice;
    filter.quantity=cart.quantity;
    filter.title=cart.title;
    for (i in filter.book)
        {
            if (String(filter.book[i]) == String(req.body.id))
            {
                filter.quantity[i] = parseInt(req.body.quantity);
            }
        }
    await cartModel.deleteCart(cart._id);
    await cartModel.addCart(filter);
    }
    res.redirect('/carts');
}

exports.cart= async (req, res) =>
{
    const ip=  req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const filter = {
        ip: new RegExp(ip, 'i'),
    }
    var total = 0;
    const cart1 = await cartModel.findCart(filter);
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
    res.render('carts/cart', {cart, total});
}

exports.detail= async (req, res) =>
{
    const book = await bookModel.get(req.params.id);
    const ip=  req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const filter = {
        ip: new RegExp(ip, 'i'),
    }
    const cart = await cartModel.findCart(filter);
    var quantity = 1;
    if (cart)
    {
        for (i in cart.book)
        {
            if (String(cart.book[i]) == String(req.params.id))
                quantity = parseInt(cart.quantity[i]);
        }
    }
        
    res.render('carts/detail', {book, quantity});
}

exports.pay = async(req, res) =>
{
    if (req.user)
    {
        const ip=  req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const filter = {
            ip: new RegExp(ip, 'i'),
        }
        const cart = await cartModel.findCart(filter);
        var total = 0;
        if (cart)
        {
            for (i in cart.book)
            {
                total = total + parseInt(cart.basePrice[i])* parseInt(cart.quantity[i]);
            }
        }
        const blance = req.user.blance;
        res.render('carts/pay', {total, blance, isEnought: blance>=total, N_blance: blance - total});
    }
    else res.redirect('/users/signin');
}

exports.payNow = async(req, res) =>
{
    const book = await bookModel.get(req.params.id);
    const ip=  req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const filter = {
        ip: new RegExp(ip, 'i'),
    }
    const cart = await cartModel.findCart(filter);
    await cartModel.deleteCart(cart._id);
    cart.username= req.user.username;
    cart.user_id= req.user._id;
    var today = new Date();
    var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    cart.dateTime = time+' '+date;
    cart.total=req.body.total;
    await userModel.addHistory(cart);console.log(req.body.total);
    const filter1 = {$set: {blance: parseInt(req.user.blance )-parseInt(req.body.total)}};
    console.log(filter1);
    await userModel.updata(req.user._id, filter1);
    res.redirect("/books");
}