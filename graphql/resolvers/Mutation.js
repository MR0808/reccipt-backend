import bcrypt from 'bcryptjs';
import validator from 'validator';

import Consumer from '../../models/consumer.js';
import AdminUser from '../../models/adminUser.js';
import Business from '../../models/business.js';

// import * as itemCategory from '../../controllers/item.js';

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
    },
    async createAdmin(parent, { adminInput }) {
        const errors = [];
        if (!validator.isEmail(adminInput.email)) {
            errors.push({ message: 'Email is invalid.' });
        }
        if (
            validator.isEmpty(adminInput.password) ||
            !validator.isLength(adminInput.password, { min: 5 })
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
            const existingAdmin = await AdminUser.findOne({
                email: adminInput.email
            });
            if (existingAdmin) {
                const error = new Error('User exists already!');
                throw error;
            }
            // try {
            const hashedPw = await bcrypt.hash(adminInput.password, 12);
            const admin = new AdminUser({
                email: adminInput.email,
                password: hashedPw,
                firstName: adminInput.firstName,
                lastName: adminInput.lastName
            });
            const createdAdmin = await admin.save();
            return {
                ...createdAdmin._doc,
                _id: createdAdmin._id.toString()
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
