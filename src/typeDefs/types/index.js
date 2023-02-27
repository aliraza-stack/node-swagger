const { gql } = require("apollo-server");

const userType = gql`
  type User {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    phone: String!
    organization: String!
    token: String
  }
`

module.exports = {
  userType
};
