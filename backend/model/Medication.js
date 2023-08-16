import { Schema, model } from 'mongoose';

const logSchema = new Schema({
    med_id: String,
    date: String,
    user_id: String,
    frequency: [
        {
            id: Number,
            state: String
        }
    ]
});

const medicationSchema = new Schema({
    _id: String,
    logs: [logSchema]
});

const Medication = model('Medication', medicationSchema);

export { Medication }