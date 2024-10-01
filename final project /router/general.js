

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
   
  //username &/ password are not provided.
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }


  //username already exists
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: 'Username already exists.' });
  }


  const newUser = { username, password };
  users.push(newUser);

  return res.status(200).json({ message: 'User registered successfully.' });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const matchBook = [];
  const bookKeys = Object.keys(books);

  bookKeys.forEach(function(key) {
    if (books[key].author === author) {
      matchBook.push({id: key, ...books[key]});
    }
  });

  if (matchBook.length === 0) {
    return res.status(404).json({message: "not found"});
  }

  return res.status(200).json(matchBook);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const matchBook = [];
  const bookKeys = Object.keys(books);

  bookKeys.forEach(function(key) {
  if (books[key].title === title) {
    matchBook.push({id: key, ...books[key]});
  }
});

if (matchBook.length === 0) {
  return res.status(404).json({message: "Book not found"});
}

return res.status(200).json(matchBook);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  
    const id = req.params.isbn;
    const book = books[id];
    if (book) {
      const reviews = book.reviews;
      if (Object.keys(reviews).length > 0) {
        return res.status(200).json(reviews);
      } 
      else{
        return res.status(404).json({})
      }
    }
  
});

module.exports.general = public_users;