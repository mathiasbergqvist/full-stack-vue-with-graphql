const { gql } = require('apollo-server');

const typeDefs = gql`
    type Query {
        dummy: String
    }
    type Todo {
        id: ID!
        task: String
        completed: Boolean
    }
`;

module.exports = typeDefs;
