import mongoose, {Schema, model} from 'mongoose';
import User from "./user";
import Message from "./message";

const chatSchema = new Schema({
    _users: {
        type: [Schema.Types.ObjectId],
        required: true,
        ref: 'User',
    },
    _messages: {
        type: [Schema.Types.ObjectId],
        ref: 'Message'
    },
    dateCreated: {
        type: Date,
        required: true
    }
});

const Chat = model('Chat', chatSchema);

export default Chat