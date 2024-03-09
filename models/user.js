import mongoose from "mongoose";
const Schema = mongoose.Schema;
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const addressSchema = new Schema({
    firstName: String,
    lastName: String,
    country: String,
    company: String,
    street: String,
    city: String,
    state: String,
    phone: Number,
    postal: Number,
    instruction: String,
},
    { timestamps: true }
);

const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    phone: {
        type: Number,
    },
    image: String,
    addressess: [addressSchema]
},
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
    catch (err) {
        return next(err);
    }
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

const User = mongoose.model("User", userSchema);

export default User;