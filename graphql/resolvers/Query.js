const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

const { authCheck } = require('../../util/user');

const Query = {
    async login(parent, { email, password }) {
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                const error = new Error('User not found');
                error.code = 401;
                throw error;
            }
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                const error = new Error('Wrong password');
                error.code = 401;
                throw error;
            }
            const token = jwt.sign(
                {
                    email: user.email,
                    userId: user._id.toString()
                },
                process.env.LOGIN_SALT,
                { expiresIn: '1h' }
            );
            return { token: token, userId: user._id.toString() };
        } catch (error) {
            if (!error.code) {
                error.code = 500;
            }
            throw error;
        }
    },
    async user(parent, args, { req }) {
        authCheck(req);
        try {
            const user = await User.findById(req.userId);
            if (!user) {
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }
            return { ...user._doc, _id: user._id.toString() };
        } catch (error) {
            if (!error.code) {
                error.code = 500;
            }
            throw error;
        }
    }
};

exports.Query = Query;
