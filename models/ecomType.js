import mongoose from 'mongoose';

const Schema = mongoose.Schema;

var ecomTypeSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model('EcomType', ecomTypeSchema);
