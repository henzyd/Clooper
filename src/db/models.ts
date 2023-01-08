/**
// ? Property attriutes
 *  name, 
    address, 
    type => flat, 
    description, 
    image_url, 
    total_rooms => 3 bdrm, 
    occupancy_type => single, 
    rent_amount => $1200, 
    rent_frequency => monthly, 
    is_published => true|false

 */

/**
// ? NOTE: User Attributes
 * first_name,
 * last_name,
 * email,
 * phone,
 * is_admin ( boolean ),
 * is_active
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

type UserModelType = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
};

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "Please enter a first name"],
  },
  last_name: {
    type: String,
    required: [true, "Please enter a last name"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please enter an email address"],
  },
  phone: {
    type: String,
    unique: true,
    required: [true, "Please enter a phone number"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: 8,
  },
  is_admin: {
    type: Boolean,
    default: false,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
});

userSchema.statics.checkIfEmailExists = async function (email: string) {
  //? This method is used to check if the email exist in the DB
  if (!email) throw new Error("Invalid email address");
  try {
    const user = await this.findOne({ email });
    if (user) return false;
    return true;
  } catch (err: any) {
    console.log("error inside checkIfEmailExists method", err.message);
  }
};

userSchema.pre("save", async function (next) {
  //? This function only runs if password was inputted or modified
  if (!this.isModified("password")) return next();

  //? Hashing the user's password with bcrypt before storing in the DB
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

const UserModel = mongoose.model("User", userSchema);

export { UserModel, UserModelType };
