const mongoose = require('mongoose');

const blogSchema= mongoose.Schema({
    title : {
        type : String,
        required : true 
      },
      author : {
        type : String,
        required : true 
      },
      content : {
        type : String,
        required : true 
      },
      total_likes : {
        type : Number,
        default: 0
      },
      total_dislikes : {
        type : Number,
        default: 0
      },
      comments: {
        type : []
      },
      users: {
        type :[]
      }
});

module.exports = mongoose.model('blog',blogSchema);