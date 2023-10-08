const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password){
      return res.status(404).send("Please provide a username and password.");
  }
  if (!isValid(username)){
      return res.send("This username is alreadt taken. Please choose another username.")
  } else {
      users.push({username, password});
      return res.status(200).send(`${username}'s account has been created.`)
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let allBooks = new Promise((resolve, reject) => {
    resolve(books);
  })
  allBooks.then((books) => {
      return res.send(JSON.stringify(books, null, 4));
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let bookByISBN = new Promise((resolve, reject) => {
    resolve(books[isbn]);
  })
  bookByISBN.then(book => {
      if (typeof book === 'undefined'){
        return res.status(404).json({message: "Book not found. Try another ISBN."})
      } else {
        return res.status(200).send(book);
      }
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  let isbnArr = Object.keys(books);
  let booksByAuthor = new Promise((resolve, reject) => {
    let booksFound = [];
    for (let i = 0; i < isbnArr.length; i++){
        if (books[isbnArr[i]].author.toLowerCase() === author.toLowerCase()){
            booksFound.push(books[isbnArr[i]]);
        }
    }
    resolve(booksFound);
  })
  booksByAuthor.then(books => {
    if (books.length > 0){
        return res.status(200).send(books);
    } else {
        return res.status(404).json({message: 'Results not found. Try another author.'})
    }
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let isbnArr = Object.keys(books);
  let booksByTitle = new Promise((resolve, reject) => {
    let booksFound = [];
    for (let i = 0; i < isbnArr.length; i++){
        if (books[isbnArr[i]].title.toLowerCase() === title.toLowerCase()){
            booksFound.push(books[isbnArr[i]]);
        }
    }
    resolve(booksFound)
  })
  booksByTitle.then(books => {
      if (books.length > 0){
          return res.status(200).send(books)
      } else {
          return res.status(404).json({message: 'Results not found. Try another title.'})
      }
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let bookReviews = {
      title: books[isbn].title,
      reviews: books[isbn].reviews
  }
  return res.send(bookReviews);
});

module.exports.general = public_users;
