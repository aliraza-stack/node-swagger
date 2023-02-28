const { ApolloServer } = require('apollo-server');
const { typeDefs } = require("./typeDefs");
const { resolvers } = require("./resolvers");
const { getPayload } = require('./util');
const db = require('../src/mongodb');
const config = require('../src/config');
const routes = require('./routes/user');
const express = require('express')
const app = express()

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../docs/swagger.json');

const port = 3000

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use('/api/v1', routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

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
    server.listen(4000).then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  }
});
