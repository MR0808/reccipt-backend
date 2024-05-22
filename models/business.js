import mongoose from 'mongoose';

const Schema = mongoose.Schema;

var businessSchema = new Schema(
    {
        businessName: {
            type: String,
            required: true
        },
        tradingName: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            require: true
        },
        genericEmail: {
            type: String,
            required: true
        },
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
        categories: {
            itemType: {
                type: Schema.Types.ObjectId,
                ref: 'ItemType'
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
