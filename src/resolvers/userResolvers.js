const { getToken, encryptPassword, comparePassword } = require("../util")
const db = require('../mongodb');
const jwt = require('jsonwebtoken')

const { AuthenticationError} = require('apollo-server');

const userResolvers = {
    Query: {
        users: {
            resolve: async (parent, args, context, info) => {
                const users = await db.getCollection('users').find().toArray()
                return users
            }
        },
        user: {
            resolve: async (parent, args, context, info) => {
                const user = await db.getCollection('users').findOne({ _id: args.id })
                return user
            }
        },
        profile: async (parent, args, context, info) => {
            const { user } = context;
            if (!user) {
            throw new AuthenticationError('You must be logged in to view this information');
            }

            try {
            const profile = await User.findById(user.id);
            return profile;
            } catch (err) {
            throw new Error('Error fetching user profile');
            }
        }
    },
    Mutation: {
        register: async (parent, args, context, info) => {
            const newUser = {
                firstName: args.firstName,
                lastName: args.lastName,
                email: args.email,
                phone: args.phone,
                organization: args.organization,
                password: await encryptPassword(args.password) }
            // Check conditions
            const user = await db.getCollection('users').findOne({ email: args.email })
            if (user) {
                throw new AuthenticationError("User Already Exists!")
            }
            const emailExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const isValidEmail = emailExpression.test(String(args.email).toLowerCase());
            if (isValidEmail === false) {
                throw new AuthenticationError("Email must be valid!")
            }
            if (args.password.length < 8) {
                throw new AuthenticationError("Password must be at least 8 characters!")
            }
            try {
                const regUser = (await db.getCollection('users').insertOne(newUser)).ops[0]
                const token = getToken(regUser);
                return { ...regUser, token }
            } catch (e) {
                throw e
            }
        },
        login: async (parent, args, context, info) => {
            const user = await db.getCollection('users').findOne({ email: args.email })
            const isMatch = await comparePassword(args.password, user.password)
            if (isMatch) {
                const token = getToken(user)
                console.log(token)
                console.log(user)
                return { ...user, token };
            } else {
                throw new AuthenticationError("Wrong Password!")
            }
        },
        forgotPassword: async (parent, args, context, info) => {
            const user = await db.getCollection('users').findOne({email: args.email})
            if (user) {
                const token = jwt.sign({email: user.email}, 'my-secret-key')
                return {success: true, token: token}
            } else {
                return {success: false, token: null}
            }
        }

    }
};

module.exports = {
    userResolvers,
}
