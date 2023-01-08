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
// ? User Attributes
 * first_name,
 * last_name,
 * email,
 * phone,
 * is_admin ( boolean ),
 * is_active
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

//? Types
type UserModelType = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  is_admin: boolean;
  is_active: boolean;
  correctPassword: (
    reqPassword: string,
    userPassword: string
  ) => Promise<boolean>;
};

type PropertyModelType = {
  name: string;
  type: string;
  address: string;
  description: string;
  image_url: string;
  total_rooms: number;
  occupancy_type: string;
  rent_amount: number;
  rent_frequency: string;
  is_published: boolean;
};

//? Schemas
const userSchema = new mongoose.Schema<UserModelType>({
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
    select: false,
  },
  is_admin: {
    type: Boolean,
    default: false,
    select: false,
  },
  is_active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

const propertySchema = new mongoose.Schema<PropertyModelType>({
  name: {
    type: String,
    required: [true, "Please enter a name"],
  },
  address: {
    type: String,
    required: [true, "Please enter an address"],
  },
  type: {
    type: String,
    required: [true, "Please enter a type"],
  },
  description: {
    type: String,
    required: [true, "Please enter a description"],
  },
  image_url: {
    type: String,
    required: [true, "Please enter an image URL"],
  },
  total_rooms: {
    type: Number,
    required: [true, "Please enter a total rooms"],
  },
  occupancy_type: {
    type: String,
  },
  rent_amount: {
    type: Number,
    required: [true, "Please enter a rent amount"],
  },
  rent_frequency: {
    type: String,
    required: [true, "Please enter a rent frequency"],
  },
  is_published: {
    type: Boolean,
    default: false,
  }, //! Add a publish date
});

//? Methods
userSchema.methods.correctPassword = async function (
  reqPassword: string,
  userPassword: string
) {
  return await bcrypt.compare(reqPassword, userPassword);
};

//? Models
const UserModel = mongoose.model("User", userSchema);
const PropertyModel = mongoose.model("Property", propertySchema);

export { UserModel, UserModelType, PropertyModel };
