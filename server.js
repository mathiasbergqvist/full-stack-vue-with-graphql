const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });
const User = require('./models/User');
const Post = require('./models/Post');

// Connect to the MongoDB database
mongoose
    .connect(process.env.MONGO_URI, {useNewUrlParser: true})
    .then(() => console.log('DB connected'))
    .catch(err => console.err);


// Start the Apollo Server
const server = new ApolloServer({
    typeDefs,
    context: {
        User,
        Post
    }
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
