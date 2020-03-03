const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

// Connect to the database
mongoose
    .connect(process.env.MONGO_URI, {useNewUrlParser: true})
    .then(() => console.log('DB connected'))
    .catch(err => console.err);

const server = new ApolloServer({
    typeDefs
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
