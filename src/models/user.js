const mongoose =require('mongoose')
// User Schema

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
      },
      email: {
        type: String,
        require: true
      },
      username: {
        type: String,
        require: true
      },
      password: {
        type: String,
        require: true
      },
      admin: {
        type: Number
      }
    
});
const User = new mongoose.model("User", userSchema)
module.exports =User