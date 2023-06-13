import {Schema, model} from 'mongoose';

const userSchema = new Schema({
    displayName: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
});

const User = model('User', userSchema);

export interface UserType extends Document {
    displayName: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    date: Date
}

export default User;