const express = require('express');
const db = require('../../mongodb');
const { getAllUsers, getUserById, registerUser } = require('../../models/user');
const router = express.Router();

router.get('/users', (req, res) => {
  getAllUsers(req, res);
});

// get user by id
router.get('/user/:id', (req, res) => {
  getUserById(req, res);
});

router.post('/register', async (req, res) => {
  registerUser(req, res);
});



module.exports = router;
