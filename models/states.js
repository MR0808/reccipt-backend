const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var stateSchema = new Schema(
    {
        isoCode: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        country: {
            type: Schema.Types.ObjectId,
            ref: 'Country'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('State', stateSchema);
