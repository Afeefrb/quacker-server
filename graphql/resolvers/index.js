const postsResolvers = require("./postsResolvers");
const usersResolvers = require("./usersResolvers");

module.exports = {
    Post: {
        likesCount: (parent) => parent.likes.length,
        commentCount: (parent) => parent.comments.length,
    },
    Query:{
        ...postsResolvers.Query
    },
    Mutation:{
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
    },
    Subscription:{
        ...postsResolvers.Subscription
    }
}