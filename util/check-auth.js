const jwt = require("jsonwebtoken");
// const { SECRET_KEY } = require("../config");
const { AuthenticationError } = require("apollo-server");

module.exports = (context) => {
    console.log("context: ",context);
    const authHeader = context.req.headers.authorization;

    if(authHeader) {
        const token = authHeader.split("Bearer ")[1];
        if(token){
            try {
                const user = jwt.verify(token, process.env.SECRET_KEY || SECRET_KEY)
                return user
            } catch (error) {
                throw new AuthenticationError("Invalid/Expired token")
            }
        }
        throw new Error("Authentication token must be \"Bearer [token]\" ")
    }

    throw new Error("Authentication header must be provided")


}