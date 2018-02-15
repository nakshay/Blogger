const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    email: {
        type: String,
        required:true,
    },
    password : {
        type:String,
        required:true
    }
});

let userModel = module.exports = mongoose.model('user',userSchema);

userModel.createUser = (newUser, callback)=> {

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
           
            userModel.findOne({username:newUser.username},(err,user)=>{

            if(typeof(user) === "undefined" || user === null){
                newUser.save(callback);
            }
            else {
                callback("error while creating user / username already taken ", null);
            }
            });

        });
    });

};


