import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try 
    {
        const token = req.cookies.jwt;    

        // Verify if a token was provided
        if (!token)
        {
            return res.status(401).json({ error: "Unauthorized: No Token Provided" });
        }

        // If token provided verify with secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify if there was a problem with the token
        if (!decoded)
        {
            return res.status(401).json({ error: "Unauthorized: Invalid Token" });
        }

        // Retrieve the user within the token minus the password
        const user = await User.findById(decoded.userId).select("-password");

        // Verify if we did retrieve a user
        if (!user)
        {
            return res.status(401).json({ error: "User not found" });
        }

        req.user = user;

        next();
    } 
    catch (error) 
    {
        console.log("Error in protectRoute middleware", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}