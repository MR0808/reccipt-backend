const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var countrySchema = new Schema(
    {
        isoCode: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        currency: {
            type: String,
            required: true
        },
        states: [
            {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'State'
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model('Country', countrySchema);
