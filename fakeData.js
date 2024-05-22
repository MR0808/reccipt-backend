import mongoose from 'mongoose';
import dummy from 'mongoose-dummy';

import Consumer from './models/consumer.js';

const ignoredFields = ['_id', 'created_at', '__v', /detail.*_info/];

let randomObject = dummy(Consumer, {
    ignore: ignoredFields,
    returnDate: true
});
console.log(randomObject);
