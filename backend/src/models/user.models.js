import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: 3,
      maxLength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },

    // Email Verification fields
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpiry: {
      type: Date,
    },

    // Password reset fields
    passwordResetToken: {
      type: String,
    },
    passwordResetExpiry: {
      type: Date,
    },
    refreshToken: {
      type: String,
    },

    // Security Audit fields

    accountStatus: {
      type: String,
      enum: ["active", "suspended", "pending"],
      default: "pending",
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
    lastLogin: {
      type: Date,
    },
    lastLoginIp: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next;
  }
  this.password = await bcrypt.hash(this.password, 10);
  next;
});

userSchema.methods.isPasswordCorrect = async function (inputedPassword) {
  return await bcrypt.compare(inputedPassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
  // short lived access token
  return jwt.sign(
    {
      userId: this._id,
      email: this.email,
      username: this.username,
      isEmailVerified: this.isEmailVerified,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      userId: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateEmailVerificationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.emailVerificationExpiry = Date.now() + 24 * 60 * 60 * 1000;
  return token;
};

userSchema.methods.generatePasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.passwordResetExpiry = Date.now() + 10 * 60 * 1000;

  return token;
};

// handle failed login attempts
userSchema.methods.incorrectLoginAttempts = function () {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 },
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };

  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 5 * 60 * 1000 }; // 5 minutes
  }

  return this.updateOne(updates);
};

// reset login attempts on successful login
userSchema.methods.resetLoginAttempts = function (ip) {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: {
      lastLogin: new Date(),
      lastLoginIp: ip,
      accountStatus: "active",
    },
  });
};

// check if account is locked
userSchema.virtual("isLocked").get(function () {
  return this.lockUntil && this.lockUntil > Date.now();
});

export const User = mongoose.model("User", userSchema);
