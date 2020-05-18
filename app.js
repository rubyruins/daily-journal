//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// var Posts = [];

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = {
	title: String,
	content: String
};

const Post = mongoose.model("Post", postSchema);

app.route("/")
	.get(function(req, res) {
		Post.find({}, function(err, foundPosts) {
			res.render("home", {homeStartingContent: homeStartingContent, Posts:foundPosts});
			console.log(req.body.searchPost);
		})
	})
	.post(function(req, res) {
		let reqTitle = _.lowerCase(req.body.searchPost);
		let found = 0;
		Post.find({}, function(err, foundPosts) {
			for (var i=0; i<foundPosts.length; i++) {
				let postTitle = _.lowerCase(foundPosts[i].title);
				if (postTitle === reqTitle) {
					found = 1;
					res.render("post", {postTitle: foundPosts[i].title, postContent: foundPosts[i].content})
				}
			}
			if (found === 0) {
				res.render("404");
			}
		})
	});

app.route("/posts/:postID")
	.get(function(req, res) {
		let reqID = req.params.postID;
		Post.findOne({_id: reqID}, function(err, post) {
			res.render("post", {postTitle: post.title, postContent: post.content})
		})
	});

app.route("/about")
	.get(function(req, res) {
		res.render("about", {aboutContent: aboutContent});
	});

app.route("/contact")
	.get(function(req, res) {
		res.render("contact", {contactContent: contactContent});
	});

app.route("/compose")
	.get(function(req, res) {
		res.render("compose");
	})
	.post(function(req, res) {
		let title = req.body.postTitle;
		let content = req.body.postContent;
		const post = new Post({
			title: title,
			content: content
		});
		post.save(function(err) {
			if(!err) {
				res.redirect("/")
			}
		});
	});

app.listen(3000, function() {
	console.log("Server started on port 3000");
});
