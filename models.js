const mongoose = require('mongoose');

const blogPostSchema = mongoose.Schema({
	  title: {type: String, required: true},
	  content: {type: String},
	  created: {type: Date, default: Date.now}
	  author: {
	    firstName: String,
	    lastName: String
	  }
	});

blogPostSchema.virtual('authorName').get(function() {
	return `${this.author.firstName} ${this.author.lastName}`.trim();
})

blogPostSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		title: this.title,
		created: this.created,
		author: this.authorName,
		content: this.content
	};
}

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = {BlogPost};