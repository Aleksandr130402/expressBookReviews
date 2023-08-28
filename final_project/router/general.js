const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
	const username = req.body.user.username;
	const password = req.body.user.password;

	if (!username || !password) {
		return res.status(404).json({ message: "Pass username and password!" });
	}

	if (isValid(username)) {
		users.push({ username: username, password: password });
		return res
			.status(200)
			.json({ message: "User is registered. You can log in" });
	} else {
		return res.status(404).json({ message: "User already exists!" });
	}
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
	let myPromise = new Promise((resolve, reject) => {
		try {
			resolve(books);
		} catch (err) {
			reject(err.toString());
		}
	});

	myPromise.then((result) => res.send(result));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
	const isbn = req.params.isbn;

	let myPromise = new Promise((resolve, reject) => {
		if (isbn > 0 && isbn <= Object.keys(books).length) {
			resolve(books[isbn].reviews);
		} else {
			const error = new Error("No such isbn!");
			error.statusCode = 404;
			reject(error);
		}
	});
	myPromise.then(
		(result) => res.send(result),
		(error) => {
			if (error.statusCode) {
				return res.status(error.statusCode).json({ message: error.message });
			}
			return res.json({ message: error.message });
		}
	);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
	let author = req.params.author;
	if (author) {
		let myPromise = new Promise((resolve, reject) => {
			const bookDetails = Object.values(books).filter(
				(book) => book.author === author
			);
			if (bookDetails.length > 0) {
				resolve(bookDetails);
			} else {
				const error = new Error("Author is not found!");
				error.statusCode = 404;
				reject(error);
			}
		});
		myPromise.then(
			(result) => res.send(result),
			(error) => {
				if (error.statusCode) {
					return res.status(error.statusCode).json({ message: error.message });
				}
				return res.json({ message: error.message });
			}
		);
	}
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
	const title = req.params.title;
	if (title) {
		let myPromise = new Promise((resolve, reject) => {
			const bookDetails = Object.values(books).filter(
				(book) => book.title === title
			);
			if (bookDetails.length > 0) {
				resolve(bookDetails);
			} else {
				const error = new Error("The title is not found!");
				error.statusCode = 404;
				reject(error);
			}
		});
		myPromise.then(
			(result) => res.send(result),
			(error) => {
				if (error.statusCode) {
					return res.status(error.statusCode).json({ message: error.message });
				}
				return res.json({ message: error.message });
			}
		);
	}
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
	const reviewIsbn = req.params.isbn;
	if (reviewIsbn > 0 && reviewIsbn <= Object.keys(books).length) {
		return res.send(books[reviewIsbn].reviews);
	} else {
		return res.status(404).json({ message: "Please pass correct isbn!" });
	}
});

module.exports.general = public_users;
