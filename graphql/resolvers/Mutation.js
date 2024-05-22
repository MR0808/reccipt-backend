import bcrypt from 'bcryptjs';
import validator from 'validator';

import Consumer from '../../models/consumer.js';
import Business from '../../models/business.js';

import authCheck from '../../util/auth.js';

const Mutation = {
    async createConsumer(parent, { consumerInput }) {
        const errors = [];
        if (!validator.isEmail(consumerInput.email)) {
            errors.push({ message: 'Email is invalid.' });
        }
        if (
            validator.isEmpty(consumerInput.password) ||
            !validator.isLength(consumerInput.password, { min: 5 })
        ) {
            errors.push({ message: 'Password too short.' });
        }
        if (errors.length > 0) {
            const error = new Error('Invalid input!');
            error.data = errors;
            error.code = 422;
            throw error;
        }
        try {
            const existingConsumer = await Consumer.findOne({
                email: consumerInput.email
            });
            if (existingConsumer) {
                const error = new Error('User exists already!');
                throw error;
            }
            // try {
            const hashedPw = await bcrypt.hash(consumerInput.password, 12);
            const consumer = new Consumer({
                email: consumerInput.email,
                password: hashedPw,
                firstName: consumerInput.firstName,
                lastName: consumerInput.lastName
            });
            const createdConsumer = await consumer.save();
            return {
                ...createdConsumer._doc,
                _id: createdConsumer._id.toString()
            };
        } catch (error) {
            if (!error.code) {
                error.code = 500;
            }
            throw error;
        }
    }
};

export default Mutation;
