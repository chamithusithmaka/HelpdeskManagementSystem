const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    full_name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    uni_id: { type: String, required: true, unique: true }, // <-- add unique: true
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["student", "lecturer"],
        default: "student",
    },
    contact_no: {
        type: String,
        required: true,
        match: [/^[0-9]{10}$/, "Contact number must be 10 digits"],
    },
    faculty: { type: String, required: true, trim: true },
});

module.exports = mongoose.model("UserModel", userSchema);