const bcrypt = require('bcryptjs');
const validator = require('validator');

const User = require('../../models/user');

const { authCheck } = require('../../util/user');

const Mutation = {
    async createUser(parent, { userInput }) {
        const errors = [];
        if (!validator.isEmail(userInput.email)) {
            errors.push({ message: 'Email is invalid.' });
        }
        if (
            validator.isEmpty(userInput.password) ||
            !validator.isLength(userInput.password, { min: 5 })
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
            const existingUser = await User.findOne({ email: userInput.email });
            if (existingUser) {
                const error = new Error('User exists already!');
                throw error;
            }
            // try {
            const hashedPw = await bcrypt.hash(userInput.password, 12);
            const user = new User({
                email: userInput.email,
                password: hashedPw,
                firstName: userInput.firstName,
                lastName: userInput.lastName
            });
            const createdUser = await user.save();
            return { ...createdUser._doc, _id: createdUser._id.toString() };
        } catch (error) {
            if (!error.code) {
                error.code = 500;
            }
            throw error;
        }
    }
};

exports.Mutation = Mutation;
