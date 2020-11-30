const bookModel = require('../models/bookModel');

exports.index = async (req, res, next) => {
    // Get books from model
    const books = await bookModel.list();
    console.log('books', books);
    // Pass data to view to display list of books
    res.render('books/list', {books});
};

exports.details = async (req, res, next) => {
    res.render('books/detail', await bookModel.get(req.params.id));
}