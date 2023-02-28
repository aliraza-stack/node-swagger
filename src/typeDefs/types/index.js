const { gql } = require("apollo-server");

const userType = gql`
  type User {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    phone: String!
    organization: String!
    token: String
  },

  type ForgotPasswordResponse {
    success: Boolean!
    token: String
  }
`

module.exports = {
  userType
};
