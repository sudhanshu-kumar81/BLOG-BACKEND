import mongoose from 'mongoose'
const feedBackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    issue: {
        type: String,
        required: true
    },
    suggestion: {
        type: String,
        required: true
    },
})
const Feedback = mongoose.model("feedback", feedBackSchema)
export default Feedback

