//▇▇▇
const {ApolloServer, PubSub} = require("apollo-server"); 

//MONGO
const mongoose = require("mongoose");
// const {MONGODB} = require("./config.js");


//GRAPHQL
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const pubsub = new PubSub();

const PORT = process.env.PORT || 5000;


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({req,pubsub})
})

mongoose.connect(process.env.MONGODB || MONGODB, {useNewUrlParser: true, useUnifiedTopology:true})
    .then(() => {
        console.log("MongoDB Connected");
        return server.listen({port:PORT})
    }).then((res) => {
        console.log(`Server running at ${res.url}`) 
    }).catch(err => {
        console.log(err);
    })

