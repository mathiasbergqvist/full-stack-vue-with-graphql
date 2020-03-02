const { gql } = require('apollo-server');

const typeDefs = gql`
    type Query {
        getTodos: [Todo]
    }
    type Todo {
        id: ID!
        task: String
        completed: Boolean
    }
`;

module.exports = typeDefs;
