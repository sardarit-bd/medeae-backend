import bcrypt from "bcryptjs";
import User from "../../models/User.js";


export const resetPassword = async (req, res, next) => {
    try {
        const decodedToken = req.user;
        const { password } = req.body;

        const user = await User.findById(decodedToken.userId);
        if (!user) {
            return res.json({
                success: false,
                statusCode: 404,
                message: "User does not found!",
                data: null,
            });
        }


        user.password = await bcrypt.hash(
            password,
            Number(10)
        );
        user.save();


        res.json({
            success: true,
            statusCode: 200,
            message: "Password Reset Successfully!",
            data: null,
        });
    } catch (err) {
        console.log(err)
        next(err)
    }
}