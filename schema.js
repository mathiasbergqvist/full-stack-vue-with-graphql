const { gql } = require('apollo-server');

const typeDefs = gql`
    type Query {
        getTodos: [Todo]
    }
    type Todo {
        task: String
        completed: Boolean
    }
`;

module.exports = typeDefs;
