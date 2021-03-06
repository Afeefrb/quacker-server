const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth")
const { AuthenticationError, UserInputError } = require("apollo-server");

module.exports = {
    Query:{ //▇▇▇
        async getPosts(){ 
            try{
                const posts = await Post.find().sort({createdAt:-1});
                return posts

            } catch(err) {
                throw new Error (err)
            }
            
        },
        async getPost(_,{postId}){
            try{
                const post = await Post.findById(postId);
                if(!post) {
                    throw new Error("Post not found")
                }
                return post

            } catch(err) {
                throw new Error(err)
            }

          
         }
    },
    Mutation: { //▇▇▇
        async createPost(_, {body}, context){

           //#context: {req:xx, pubsub:xx}

            const user = checkAuth(context);
            console.log("user: ",user);

            if (body.trim() === '') {
                throw new Error('Body must not be empty');
              }

            const newPost = new Post({
                body,
                user:user.id, //% user object poppulated in Post model
                username:user.username,
                createdAt: new Date().toISOString()
            })

            const post = await newPost.save();

            context.pubsub.publish("NEW_POST", {
                newPost:post
            })

            return post
        },
        async deletePost(_, {postId}, context){ //* DELETE POST**************---------****
            const user = checkAuth(context);
            try{
                const post = await Post.findById(postId)
                if(user.username === post.username){
                    await post.delete();
                    return "Post deleted Successfully"
                } else {
                    throw new AuthenticationError("Action not allowed")
                }


            } catch(err) {
             throw new Error(err)               
            }
        },
        createComment: async(_, {postId, body},context) => {
            const {username} = checkAuth(context); //# user: {username, email, createdAt...}

            if(body.trim() === '') {
                throw new UserInputError("Empty Comment", {
                    errors: {
                        body: "Comment body must not be empty"
                    }
                })
            }

            const post = await Post.findById(postId);

            if(post) {
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })
    
                await post.save();
                return post

            } else {
                throw new UserInputError("Post not found")
            }

           
        },
        deleteComment: async(_, {postId, commentId},context) => {
            const {username} = checkAuth(context);

            const post = await Post.findById(postId);

            if(post) {
                const commentIndex = post.comments.findIndex((c) => c.id === commentId);

                if(post.comments[commentIndex].username === username) {
                    post.comments.splice(commentIndex,1)
                    await post.save()
                    return post
                } else {
                    throw new AuthenticationError("Action not allowed")
                }
 
                
            } else {

                throw new UserInputError("Post not found") 
            }
        },
        async likePost(_,{postId},context){ 

            const {username} = checkAuth(context);
            const post = await Post.findById(postId);
            if(post) {
                //alredy liked, unlike it
                if(post.likes.find(like => like.username === username)) {
                    post.likes = post.likes.filter(like => like.username !== username)

                } else {
                      //not liked, like it
                    post.likes.push({
                    username,
                    createdAt: new Date().toISOString()
                    })

                }
                await post.save();
                return post;
            } else throw new UserInputError("Post not found")
            
        } 
    },
    Subscription:{ //▇▇▇
        newPost:{
            //#context: {req:xx, pubsub:xx}
            subscribe: (_, __ , {pubsub}) => pubsub.asyncIterator("NEW_POST")
        }
    }
}