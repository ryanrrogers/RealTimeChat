import {Schema, model} from 'mongoose';

const messageSchema = new Schema({
    _user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    _chat: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Chat'
    },
    body: {
        type: String,
        required: true,
    }
});

const Message = model('Message', messageSchema);

export default Message;