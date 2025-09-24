import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id: user._id }
        next();
    } catch (err) {
        console.error("JWT verification error:", err);
        res.status(401).json({ msg: "Token is not valid" });
    }
};
