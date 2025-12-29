const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: { type: String, required: [true, "Password is required"] },
    status:{type:String , default:"active" },
    profilePhoto: {
      type: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/image-to-url-converter-9483c.appspot.com/o/test%40gmail.com%20%2B%201767014856794?alt=media&token=6337cf43-7e51-44cb-a5a9-05e9706afe1f",
    },
    role: {
      type: String,
      enum: ["customer", "vendor", "admin"],
      default: "customer",
    },
  },
  { timestamps: true }
);

// Password hashing before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
