import jwt from "jsonwebtoken";

const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        console.log("Token not available");
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log("Error:", err);
        }
        req.user = user;
        next();
    });
}

export default authenticateUser;