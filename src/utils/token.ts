import jwt from "jsonwebtoken";
import ms from "ms";

type UserReqOBJ = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
};

/**
 * This is a function that creates a new JWT token for a user
 * @returns `String` a JWT token
 */
function signinJWT(user: UserReqOBJ) {
  const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
    expiresIn: ms(process.env.JWT_EXPIRE_IN),
  });
  console.log(token);

  return token;
}

export { signinJWT };
