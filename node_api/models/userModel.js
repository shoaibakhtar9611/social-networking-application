const mongoose = require('mongoose');
const validator = require('validator');
const uuidv1 = require('uuid/v1');
const bcrypt = require('bcryptjs');
// const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid Email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password should contain atleast 8 characters']
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date
  },
  photo: {
    type: String
  },
  following: [{
    type: mongoose.Schema.ObjectId,
    ref: "User"
  }],
  followers: [{
    type: mongoose.Schema.ObjectId,
    ref: "User"
  }]

});

// Password Encryption
userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if(!this.isModified('password'))
    return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.methods.authenticate = async function(candidatePassword, hashedPassword) {
  
  // Here userPassword is hashed and candidatePassword is not
  const res = await bcrypt.compare(candidatePassword, hashedPassword);
  return res;
  
};

// // Virtual Field
// userSchema.virtual('password').set( function(password) {
//   // Create a temporary variable called _password
//   this._password = password;

//   // Generate a timestamp
//   this.salt = uuidv1();

//   // Encrypt the password
//   this.hashed_password = this.encryptPassword(password);
// })
// .get(function() {
//   return this._password;
// });


// Methods added to Schema
// userSchema.methods = {
//   encryptPassword: function(password) {
//     try {
//       return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
//     } catch (err) {
//       return err.message;
//     }
//   },

//   authenticate: function(password) {
//     const pwd = this.encryptPassword(password);
    
//     return (pwd === this.hashed_password);
//   }

// };

const User = mongoose.model('User', userSchema);

module.exports = User;
