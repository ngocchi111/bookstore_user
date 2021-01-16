const bookModel = require('../models/bookModel');
const cmtModel = require('../models/cmtModel');
const cartModel = require('../models/cartModel');
const { param } = require('../routes/users');
const { ObjectId } = require('mongodb');

exports.index = async (req, res, next) => {
    // Get books from model
    const pageNumber = +req.query.page || 1;
    const itemPerPage = +req.query.item || 10;
    const filter={};
    filter.status = 1;
    const q= req.query.q;
    const catalog = req.query.cat;
    const author = req.query.author;
    var link ="";
    if (q)
    {
        filter.title= new RegExp(q, 'i');
        link=link+"&q="+q;
    }
    if (catalog)
    {
        filter.catalog=new RegExp(catalog, 'i');
        link=link+"&cat="+catalog;
    }
    if (author)
    {
        filter.author=new RegExp(author, 'i');
        link=link+"&author="+author;
    }
    const authors = await bookModel.authors();
    const catalogs = await bookModel.catalogs();
    const bookTotal = await bookModel.count(filter);
    const books =  await bookModel.list(filter, pageNumber, itemPerPage);
    res.render('books/list', {books, authors, catalogs,
         hasNextPage: itemPerPage*pageNumber < bookTotal,
         hasPrevPage: pageNumber > 1,
         hasPage: (itemPerPage*pageNumber < bookTotal) || pageNumber > 1,
         nextPage: pageNumber+1,
         prevPage: pageNumber-1,
         lastPage: Math.floor((bookTotal+itemPerPage)/itemPerPage),
         itemPerPage,
         pageNumber,
         link,
    });
};

exports.details = async (req, res, next) => {
    const book = await bookModel.get(req.params.id);
    const filter={}
    filter.status = 1;
    filter.author=new RegExp(book.author, 'i');
    const filter_catalog = {};
    filter_catalog.status = 1;
    filter_catalog.catalog=new RegExp(book.catalog, 'i');
    const books = await bookModel.list(filter, 1, 4);
    const books_catalog = await bookModel.list(filter_catalog, 1, 4);
    for (i in books_catalog)
    {
        var is=false;
        for (j in books)
            if (books[j].title == books_catalog[i].title)
                is=true;
        if (!is)
        books.push(books_catalog[i]);
    }
    for (i in books)
    {
        if (books[i].title == book.title)
            books[i].isBook = false;
        else
            books[i].isBook = true;
    }
    const id = new RegExp(book._id, 'i');
    const pageNumber = + req.query.page|| 1;
    const itemPerPage = 10;
    const cmtTotal = await cmtModel.count(id);
    const comments = await cmtModel.comments(id, pageNumber, itemPerPage);
    res.render('books/detail', {book, books, comments, 
        hasNextPage: itemPerPage*pageNumber < cmtTotal,
        hasPrevPage: pageNumber > 1,
        hasPage: (itemPerPage*pageNumber < cmtTotal) || pageNumber > 1,
        nextPage: pageNumber+1,
        prevPage: pageNumber-1,
        lastPage: Math.floor((cmtTotal+itemPerPage)/itemPerPage),
        itemPerPage,
        pageNumber,
    });
}

exports.addCmt = async (req, res, next)=>
{
    const cmt ={
    };
    if (req.user)
    {   
        cmt.name= req.user.name;
    }
    else
        cmt.name= req.body.name;
    cmt.comment = req.body.comment;
    cmt.id_book= req.body.id;
    cmt.title= req.body.title;
    var today = new Date();
    var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    cmt.dateTime = time+' '+date;
    await cmtModel.addCmt(cmt);
    res.redirect('back');
}

exports.addToCart = async(req, res)=>
{
    res.render('books/addToCart', await bookModel.get(req.params.id));
}

exports.postCart = async(req, res)=>
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
        filter.title=cart.title;
        filter.basePrice=cart.basePrice;
        filter.quantity=cart.quantity;
        var t = true;
        for (i in filter.book)
        {
            if (String(filter.book[i]) == String(req.body.id))
            {
                filter.quantity[i] = parseInt(filter.quantity[i]) +  parseInt(req.body.quantity);
                t=false;
            }
        }
        if (t==true)
        {
            filter.book.push(req.body.id);
            filter.basePrice.push(req.body.basePrice);
            filter.title.push(req.body.title);
            filter.quantity.push(parseInt(req.body.quantity));
        }
        await cartModel.deleteCart(cart._id);
        await cartModel.addCart(filter);
    }
    else
    {
        filter.book[0] = req.body.id;
        filter.basePrice[0] = req.body.basePrice;
        filter.title[0]= req.body.title;
        filter.quantity[0] = parseInt(req.body.quantity);
        await cartModel.addCart(filter);
    }
    res.redirect('/books');
}