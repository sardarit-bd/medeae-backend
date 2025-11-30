import User from "../models/User.js";
import { verifyToken } from "../utils/jwt.js";


export const checkAuth =
    (...roles) =>
        async (req, res, next) => {
            try {
                const accessToken = req?.headers?.authorization || req?.cookies?.accessToken;
                if (!accessToken) {
                    return res.json({
                        success: false,
                        statusCode: 403,
                        message: "Missing Access Token"
                    })
                }

                const verifiedToken = verifyToken(
                    accessToken,
                    process.env.JWT_ACCESS_SECRET
                );

                if (!verifiedToken) {
                    return res.json({
                        success: false,
                        statusCode: 403,
                        message: "You are not authorized"
                    })
                }

                const isUserExist = await User.findOne({ email: verifiedToken.email });

                if (!isUserExist) {
                    return res.json({
                        success: false,
                        statusCode: 404,
                        message: "User does not exist"
                    })
                }

                if (!roles.includes(verifiedToken.role)) {
                    return res.json({
                        success: false,
                        statusCode: 404,
                        message: "You are not permitted to this route!!!"
                    })
                }

                req.user = verifiedToken;
                next();
            } catch (error) {
                next(error);
            }
        };