const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    //write code to check is the username is valid
    let usersWithUsername = users.filter(user => user.username === username);
    if (usersWithUsername.length > 0){
        return false
    } else {
        return true
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let authorizedUsers = users.filter(user => user.username === username && user.password === password);
if (authorizedUsers.length > 0){
    return true
} else {
    return false
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password){
      return res.status(404).send("Please provide a username and password");
  }
  if (authenticatedUser(username,password)){
    let accessToken = jwt.sign({data: password}, 'access', {expiresIn: 60 * 60});
    req.session.authorization = {accessToken, username}
    return res.status(200).send(`${username} is successfully logged in.`)
  } else {
    return res.status(208).send("Invalid Login. Incorrect username or passowrd.")
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let reviewText = req.query.review;
  let username = req.session.authorization['username'];
  let userReviews = Object.keys(books[isbn].reviews);
  if (!reviewText){
    return res.status(208).send('No review has been entered.')
  }
  books[isbn].reviews[username] = reviewText;
  if (userReviews.includes(username)){
    return res.send(`${username}'s review has been updated.`)
  } else {
    return res.send(`${username} has added a review.`);
  }
});

//Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let username = req.session.authorization['username'];
    let userReviews = Object.keys(books[isbn].reviews);
    if (userReviews.includes(username)){
        delete books[isbn].reviews[username];
        return res.send(`${username}'s review has been deleted.`)
    } else {
        return res.status(404).send(`${username} has no reviews for this book.`);
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
