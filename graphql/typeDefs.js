const gql = require("graphql-tag");

module.exports = gql`

    type Post {
        id: ID!
        body: String!
        createdAt: String!
        username: String!
        comments:[Comment]!
        likes:[Like]!
        likesCount: Int! 
        commentCount:Int! 
    }

    type Comment{
        id: ID!
        username:String!
        body: String!
        createdAt:String!
    }

    type Like {
        id:ID!,
        username:String!,
        createdAt:String!
    }

    type User{
        id: ID!
        username:String! 
        email:String!
        createdAt: String!
        token: String!
    }

    input RegisterInput{
        username:String!
        email: String!
        password: String!
        confirmPassword: String
    } 

    type Query {
        getPosts: [Post]
        getPost(postId:ID!): Post
    }  

    type Mutation{
        register(registerInput:RegisterInput): User!
        login(username:String!, password: String!): User!
        createPost(body:String!):Post!
        deletePost(postId:ID!): String!
        createComment(postId:String!, body:String!):Post!
        deleteComment(postId:ID!, commentId:ID!):Post!
        likePost(postId:ID!):Post!
    }

    type Subscription{
        newPost: Post!
    }
    
`;