import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import Consumer from '../../models/consumer.js';
import AdminUser from '../../models/adminUser.js';
import Country from '../../models/countries.js';
import State from '../../models/states.js';

import authCheck from '../../util/auth.js';

const Query = {
    async login(parent, { email, password }) {
        try {
            const user = await AdminUser.findOne({ email: email });
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
            const user = await AdminUser.findById(req.userId);
            if (!consumer) {
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
    },
    async consumer(parent, args, { req }) {
        authCheck(req);
        try {
            const consumer = await Consumer.findById(req.userId);
            if (!consumer) {
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }
            return { ...consumer._doc, _id: consumer._id.toString() };
        } catch (error) {
            if (!error.code) {
                error.code = 500;
            }
            throw error;
        }
    }
};

export default Query;
