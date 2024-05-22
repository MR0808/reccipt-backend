import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import Consumer from '../../models/consumer.js';
import Country from '../../models/countries.js';
import State from '../../models/states.js';

import authCheck from '../../util/auth.js';

const Query = {
    async login(parent, { email, password }) {
        try {
            const consumer = await Consumer.findOne({ email: email });
            if (!consumer) {
                const error = new Error('User not found');
                error.code = 401;
                throw error;
            }
            const isEqual = await bcrypt.compare(password, consumer.password);
            if (!isEqual) {
                const error = new Error('Wrong password');
                error.code = 401;
                throw error;
            }
            const token = jwt.sign(
                {
                    email: consumer.email,
                    consumerId: consumer._id.toString()
                },
                process.env.LOGIN_SALT,
                { expiresIn: '1h' }
            );
            return { token: token, consumerId: consumer._id.toString() };
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
