const { getToken, encryptPassword, comparePassword } = require("../util")
const db = require('../mongodb');

const { AuthenticationError} = require('apollo-server');

const userResolvers = {
    Query: {
        profile: (parent, args, context, info) => {
            // console.log(context.user)
            if (context.loggedIn) {
                return context.user
            } else {
                throw new AuthenticationError("Please Login Again!")
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
            const user = await db.getCollection('user').findOne({ email: args.email })
            const isMatch = await comparePassword(args.password, user.password)
            if (isMatch) {
                const token = getToken(user)
                console.log(token)
                return { ...user, token };
            } else {
                throw new AuthenticationError("Wrong Password!")
            }
        },
    }
};

module.exports = {
    userResolvers,
}
