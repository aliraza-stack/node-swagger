const db = require('../mongodb');
const { getToken, encryptPassword, comparePassword } = require('../util');




exports.getAllUsers = (req, res) => {
  const collection = db.getCollection('users');

  collection.find({}).toArray((err, users) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.json(users);
    }
  });
};

// get user by id
exports.getUserById = (req, res) => {
  const collection = db.getCollection('users');

  collection.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.json(user);
    }
  });
};