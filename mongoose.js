let mongoose = require('mongoose')
const { Schema } = require('mongoose');

mongoose.connect(process.env['DB'], { useNewUrlParser: true, useUnifiedTopology: true });

let bookSchema = new Schema({
    title: {type: String, required: true},
    comments: [String]
})

const Book = mongoose.model("Book", bookSchema);

module.exports = {
    Book, 
}