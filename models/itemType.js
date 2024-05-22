import mongoose from 'mongoose';

const Schema = mongoose.Schema;

var itemTypeSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model('ItemType', itemTypeSchema);
