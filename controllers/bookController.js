const bookModel = require('../models/bookModel');

exports.index = async (req, res, next) => {
    // Get books from model
    const pageNumber = +req.query.page || 1;
    const itemPerPage = +req.query.item || 10;
    const filter={};
    filter.status = 1;
    const q= req.query.q;
    const catalog = req.query.cat;
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
    const bookTotal = await bookModel.count(filter);
    const books =  await bookModel.list(filter, pageNumber, itemPerPage);
    res.render('books/list', {books, 
         hasNextPage: itemPerPage*pageNumber < bookTotal,
         hasPrevPage: pageNumber > 1,
         hasPage: pageNumber<=bookTotal,
         nextPage: pageNumber+1,
         prevPage: pageNumber-1,
         lastPage: Math.floor(bookTotal/itemPerPage),
         itemPerPage,
         pageNumber,
         link,
    });
};

exports.details = async (req, res, next) => {
    res.render('books/detail', await bookModel.get(req.params.id));
}