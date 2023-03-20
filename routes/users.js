// Import the Mongoose library
var mongoose = require("mongoose");
// Import the passport-local-mongoose library
var plm = require('passport-local-mongoose');

// Set the strictQuery option to false in Mongoose
mongoose.set('strictQuery', false);

// Connect to the n12database MongoDB database running on localhost
mongoose.connect("mongodb://127.0.0.1:27017/n12database");

// Define a user schema with three fields: username, password, and profileimage
var userSchema = mongoose.Schema({
    username: String,
    password: String,
    profileimage: String
});

// Apply the passport-local-mongoose plugin to the user ;schema
userSchema.plugin(plm);

// Export the user model
module.exports = mongoose.model("users", userSchema);
