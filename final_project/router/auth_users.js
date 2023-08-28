const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
	//returns boolean
	//write code to check is the username is valid
	const userAlreadyExists = users.filter((user) => user.username === username);
	if (userAlreadyExists.length > 0) {
		return false;
	} else {
		return true;
	}
};

const authenticatedUser = (username, password) => {
	//returns boolean
	//write code to check if username and password match the one we have in records.
	const matchedUsers = users.filter(
		(user) => user.username === username && user.password === password
	);
	if (matchedUsers.length > 0) {
		return true;
	} else {
		return false;
	}
};

//only registered users can login
regd_users.post("/login", (req, res) => {
	const user = req.body.user;
	if (!user) {
		return res.status(404).json({ message: "Body Empty" });
	}
	if (authenticatedUser(user.username, user.password)) {
		let accessToken = jwt.sign(
			{
				data: user,
			},
			"access",
			{ expiresIn: 60 * 60 }
		);
		req.session.authorization = {
			accessToken,
		};
		return res.status(200).send("User successfully logged in");
	} else {
		return res.status(403).json({ message: "Please, sign in!" });
	}
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
	let isbn = req.params.isbn;
	const postedReview = req.query.review;
	const currentBook = books[isbn];
	const bookReviews = currentBook.reviews;

	bookReviews[req.user.data.username] = postedReview;

	return res.status(200).json({ message: "A review is successfully created!" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
	let isbn = req.params.isbn;
	const currentBook = books[isbn];
	const username = req.user.data.username;

	if (currentBook.reviews[username]) {
		delete currentBook.reviews[username];
		return res.status(200).send("Review is successfully deleted.");
	}

	return res.status(404).json({ message: "No user reviews!" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
