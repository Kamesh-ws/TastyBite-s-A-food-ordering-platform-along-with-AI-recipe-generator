import mongoose from "mongoose";
import bcrypt from "bcryptjs";
// import validator from 'validator';

const addressSchema = new mongoose.Schema({
    address: { type: String },
    city: { type: String },
    state: { type: String },
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // validate: [validator.isEmail, "Please provide a valid email address"],
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Password must be at least 6 characters"],
    },
    phoneNo: {
        type: String,
        match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
    },

    addresses: addressSchema,

    role: {
        type: String,
        enum: ['user', 'restaurant', 'admin'],
        default: 'user',
    },
    googleId: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash password before saving user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


userSchema.methods.isValidPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password)
}

export const User = mongoose.model("User", userSchema);
