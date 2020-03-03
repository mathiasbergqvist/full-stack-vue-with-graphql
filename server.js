const { ApolloServer } = require('apollo-server');
const resolvers = require('./resolvers');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Read type defs from file path
const filePath = path.join(__dirname, 'typeDefs.gql');
const typeDefs = fs.readFileSync(filePath, 'utf-8');

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
    resolvers,
    context: {
        User,
        Post
    }
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
