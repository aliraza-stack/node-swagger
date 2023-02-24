const { ApolloServer } = require('apollo-server');
const { typeDefs } = require("./typeDefs");
const { resolvers } = require("./resolvers");
const { getPayload } = require('./util');
const db = require('./mongodb');
const config = require('./config');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // get the user token from the headers
    const token = req.headers.authorization || '';
    // try to retrieve a user with the token
    const { payload: user, loggedIn } = getPayload(token);

    // add the user to the context
    return { user, loggedIn };
  },
});

// Connect to DB
db.connect(config.database, (err) => {
  if (err) {
    console.error(err)
  } else {
    server.listen().then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
    console.log('🚀  Database Connected Successfully');
  }
});