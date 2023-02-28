const { gql } = require("apollo-server");

const query = gql`
  type Query {
    users: [User]
    user(_id: ID!): User
    profile: User
  }
  type Mutation {
    register(
      firstName: String!,
      lastName: String!,
      email: String!,
      password: String!,
      phone: String!,
      organization: String!
    ): User
    login(
      email: String!,
      password: String!
    ): User

    forgotPassword(
      email: String!
    ): ForgotPasswordResponse!
  }
`;

module.exports = {query};
