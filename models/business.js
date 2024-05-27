import mongoose from 'mongoose';

const Schema = mongoose.Schema;

var businessSchema = new Schema(
    {
        businessName: {
            type: String,
            required: true
        },
        tradingName: String,
        phoneNumber: String,
        genericEmail: String,
        address1: String,
        address2: String,
        suburb: String,
        postcode: String,
        state: String,
        country: String,
        logoUrl: String,
        primaryContact: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'BusinessUser'
        },
        users: [
            {
                type: Schema.Types.ObjectId,
                ref: 'BusinessUser'
            }
        ],
        abn: String,
        acn: String,
        status: {
            type: String,
            enum: ['Draft', 'Pending', 'Active']
        },
        categories: {
            businessType: {
                type: Schema.Types.ObjectId,
                ref: 'BusinessType'
            },
            eComType: {
                type: Schema.Types.ObjectId,
                ref: 'eComType'
            }
        }
    },
    { timestamps: true }
);

export default mongoose.model('Business', businessSchema);
