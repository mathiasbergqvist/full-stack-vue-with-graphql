const { ApolloServer, gql } = require("apollo-server");
const typeDefs = require('./schema');

const todos = [
    { task: "Learn Vue.js", completed: false },
    { task: "Learn Apollo", completed: true }
];

const server = new ApolloServer({
    typeDefs
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
