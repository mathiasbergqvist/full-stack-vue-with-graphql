const { gql } = require('apollo-server');

const typeDefs = gql`
    type Query {
        getTodos: [Todo]
    }
    type Mutation {
        addTodo(task: String, completed: Boolean): Todo
    }
    type Todo {
        task: String
        completed: Boolean
    }
`;

module.exports = typeDefs;
