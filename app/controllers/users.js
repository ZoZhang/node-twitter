const Mongoose = require("mongoose");
const Tweet = Mongoose.model("Tweet");
const User = Mongoose.model("User");
const Analytics = Mongoose.model("Analytics");
const logger = require("../middlewares/logger");

exports.authCallback = (req, res) => {
  res.redirect("/");
};

exports.signup = (req, res) => {
  res.render("pages/signup", {
    title: "Sign up",
    message: req.flash("error"),
  });
};

exports.login = (req, res) => {
  res.render("pages/login", {
    title: "Login",
    message: req.flash("error"),
  });
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect("/login");
};

exports.session = (req, res) => {
  res.redirect("/");
};

exports.create = (req, res, next) => {
  const user = new User(req.body);

  if (req.body.signup !== undefined) {
    user.bio = '';
    user.provider = 'local';
    user.url_path = user.username.replace(/\s+/g, '').toLocaleLowerCase();
    user.avatar_url = generatorAvatar(user.username);
  }

  user
    .save()
    .catch(error => {
      return res.render("pages/login", { errors: error.errors, user: user });
    })
    .then(() => {
      return req.login(user, function() {
      });
    })
    .then(() => {
      return res.redirect("/");
    })
    .catch(error => {
      return next(error);
    });
};

exports.update = (req, res, next) => {

  if (!req.user) {
    return res.redirect('/login');
  }

  const user = req.user;

  user.email = req.body.email;
  user.username = req.body.username;
  user.bio = req.body.description;
  //user.password = ''; //TODO

  user
    .save()
    .catch(error => {
      return res.render("pages/login", { errors: error.errors, user: user });
    })
    .then(() => {
      return res.redirect("/users/" + user._id);
    })
    .catch(error => {
      return next(error);
    });
}

exports.profile = (req, res) => {
  const user = req.profile;
  const reqUserId = user._id;
  const userId = reqUserId.toString();
  const page = (req.query.page > 0 ? req.query.page : 1) - 1;
  const options = {
    perPage: 100,
    page: page,
    criteria: { user: userId }
  };
  let tweets, tweetCount;
  let followingCount = user.following.length;
  let followerCount = user.followers.length;

  Tweet.list(options)
    .then(result => {
      tweets = result;
      return Tweet.countUserTweets(reqUserId);
    })
    .then(result => {
      tweetCount = result;
      res.render("pages/profile", {
        title: "Tweets de " + user.name,
        user: user,
        tweets: tweets,
        pageName:'profile',
        tweetCount: tweetCount,
        followerCount: followerCount,
        followingCount: followingCount
      });
    })
    .catch(error => {
      return res.render("pages/500", { errors: error.errors });
    });
};

exports.list = (req, res) => {
  const page = (req.query.page > 0 ? req.query.page : 1) - 1;
  const perPage = 5;
  const options = {
    perPage: perPage,
    page: page
  };
  let users, count;
  User.list(options)
    .then(result => {
      users = result;
      return User.countDocuments();
    })
    .then(result => {
      count = result;
      res.render("pages/user-list", {
        title: "List des utilisateurs",
        users: users,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      });
    })
    .catch(error => {
      return res.render("pages/500", { errors: error.errors });
    });
};

exports.show = (req, res) => {
  const user = req.profile;
  const reqUserId = user._id;
  const userId = reqUserId.toString();
  const page = (req.query.page > 0 ? req.query.page : 1) - 1;
  const options = {
    perPage: 100,
    page: page,
    criteria: { user: userId }
  };
  let tweets, tweetCount;
  let followingCount = user.following.length;
  let followerCount = user.followers.length;

  Tweet.list(options)
    .then(result => {
      tweets = result;
      return Tweet.countUserTweets(reqUserId);
    })
    .then(result => {
      tweetCount = result;
      res.render("pages/users", {
        title: "Tweets de " + user.name,
        user: user,
        tweets: tweets,
        pageName:'profile',
        tweetCount: tweetCount,
        followerCount: followerCount,
        followingCount: followingCount
      });
    })
    .catch(error => {
      return res.render("pages/500", { errors: error.errors });
    });
};

exports.user = (req, res, next, id) => {
  User.findOne({ _id: id }).exec((err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Error("échec du chargement de l'utilisateur " + id));
    }
    req.profile = user;
    next();
  });
};

exports.showFollowers = (req, res) => {
  showFollowers(req, res, "followers");
};

exports.showFollowing = (req, res) => {
  showFollowers(req, res, "following");
};

exports.delete = (req, res) => {
  Tweet.remove({ user: req.user._id })
    .then(() => {
      User.findByIdAndRemove(req.user._id)
        .then(() => {
          return res.redirect("/login");
        })
        .catch(() => {
          res.render("pages/500");
        });
    })
    .catch(() => {
      res.render("pages/500");
    });
};

function showFollowers(req, res, type) {
  let user = req.profile;
  let followers = user[type];
  let tweetCount;
  let followingCount = user.following.length;
  let followerCount = user.followers.length;
  let userFollowers = User.find({ _id: { $in: followers } }).populate(
    "user",
    "_id name username avatar_url url_path"
  );

  Tweet.countUserTweets(user._id).then(result => {
    tweetCount = result;
    userFollowers.exec((err, users) => {
      if (err) {
        return res.render("pages/500");
      }
      res.render("pages/followers", {
        user: user,
        followers: users,
        pageName:'profile',
        tweetCount: tweetCount,
        followerCount: followerCount,
        followingCount: followingCount
      });
    });
  });
}

function generatorAvatar(username) {
  const themes = ["frogideas", "sugarsweets", "heatwave", "daisygarden", "seascape", "summerwarmth", "bythepool", "duskfalling"];
  const theme = Math.floor(Math.random() * themes.length);

  const avatar = 'http://tinygraphs.com/squares/' + username + '?theme=' + themes[theme] + '&numcolors=2&size=220&fmt=svg';

  return avatar;
}
