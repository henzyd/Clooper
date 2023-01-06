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

type UserModelType = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  is_admin: boolean;
  is_active: boolean;
};

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
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

const UserModel = mongoose.model("User", userSchema);

export { UserModel, UserModelType };
