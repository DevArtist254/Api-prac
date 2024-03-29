const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    unique: [true, 'Error try again'],
    maxLength: [30, 'A name must have less or equal then 30 characters'],
    minLength: [10, 'A name name must have more or equal then 10 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowerCase: true,
    validate: [validator.isEmail, 'Please provide a vaild email'],
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      //Checker - true or false
      validator: function (el) {
        //if false it's going to return our validation error message
        return el === this.password;
      },
      //message
      message: 'Please confirm your password',
    },
  },
  //To be updated in the UI
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

// userSchema.pre('save', function (next) {
//   if (!this.isModified('password') || !this.new) return next();
// });

userSchema.pre('save', async function (next) {
  //space between getting the data and saving the data
  if (!this.isModified('password')) return next();

  //Hash with cost of 12
  this.password = await bcryptjs.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.passwordCompare = async function (
  currentPassword,
  userPassword
) {
  return await bcryptjs.compare(currentPassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTiat) {
  if (this.passwordChangedAt) {
    //convert our timestamp to ms to the base of 10 as an interger
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTiat < changedTimeStamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  //Generate reset token from crypto
  const resetToken = crypto.randomBytes(32).toString('hex');

  //Hash it
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  //password should expire after 10 min
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
