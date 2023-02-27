const { gql } = require("apollo-server");

const query = gql`
  type Query {
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
  }
`;

module.exports = {query};
