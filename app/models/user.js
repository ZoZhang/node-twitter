const mongoose = require("mongoose");
const Tweet = mongoose.model("Tweet");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const authTypes = ['local'];

// ## Define UserSchema
const UserSchema = new Schema(
  {
    bio: String,
    email: String,
    username: String,
    url_path: String,
    provider: String,
    avatar_url: String,
    hashedPassword: String,
    salt: String,
    followers: [{ type: Schema.ObjectId, ref: "User" }],
    following: [{ type: Schema.ObjectId, ref: "User" }],
    tweets: Number,
    createdAt: { type: Date, default: Date.now }
  },
  { usePushEach: true }
);

UserSchema.virtual("password")
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

const validatePresenceOf = value => value && value.length;

UserSchema.path("email").validate(function(email) {
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return email.length;
}, "L'E-mail est obligatoire!");

UserSchema.path("username").validate(function(username) {
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return username.length;
}, "Le username est obligatoire!");

UserSchema.path("hashedPassword").validate(function(hashedPassword) {
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return hashedPassword.length;
}, "Le mot de passe est obligatoire!");

UserSchema.pre("save", function(next) {
  if (
    !validatePresenceOf(this.password) &&
    authTypes.indexOf(this.provider) === -1
  ) {
    next(new Error("le mot de passe est invalide !"));
  } else {
    next();
  }
});

UserSchema.methods = {
  authenticate: function(password) {
    return bcrypt.compare(password, this.hashedPassword).then((result)=>{
      if(result){
        console.log('authentication successful');
        return true;
      } else {
        console.log('authentication failed. Password doesn\'t match');
        return false;
      }
    });
  },

  makeSalt: function() {
    return bcrypt.genSaltSync(10);
  },

  encryptPassword: function(password) {
    if (!password) {
      return '';
    }
    let salt = this.makeSalt();
    return bcrypt.hashSync(password, salt);
  },
};

UserSchema.statics = {
  addfollow: function(id, cb) {
    this.findOne({ _id: id })
      .populate("followers")
      .exec(cb);
  },
  countUserTweets: function(id, cb) {
    return Tweet.find({ user: id })
      .countDocuments()
      .exec(cb);
  },
  load: function(options, cb) {
    options.select = options.select || "username avatar_url url_path";
    return this.findOne(options.criteria)
      .select(options.select)
      .exec(cb);
  },
  list: function(options) {
    const criteria = options.criteria || {};
    return this.find(criteria)
      .populate("user", "username avatar_url url_path")
      .limit(options.perPage)
      .skip(options.perPage * options.page);
  },
  countTotalUsers: function() {
    return this.find({}).countDocuments();
  }
};

mongoose.model("User", UserSchema);
