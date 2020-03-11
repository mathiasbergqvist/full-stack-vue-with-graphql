const mongoose = require("mongoose");
const md5 = require("md5");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  favorites: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: "Post"
  }
});

/** MIDDLEWARES */

// Create and add avatar to user
UserSchema.pre("save", function(next) {
  const usernameHash = md5(this.username);
  this.avatar = `http://gravatar.com/avatar/${usernameHash}?d=identicon`;
  next();
});

// Hash password so that it can't be seen w/ access to database
UserSchema.pre("save", function(next) {
  // If the password is not modified (user signup), just exit to next function
  if (!this.isModified("password")) {
    return next();
  }

  // Generate salt and hash for password
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }

      this.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model("User", UserSchema);
