import { userSchema } from "../db/models.js";

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Swagger Property Manager - OpenAPI 3.0.3",
      description:
        "This is a property manager built with Express.js, TypeScript and Mongoose",
      version: "1.0.0",
    },
    tags: [
      {
        name: "auth",
        description: "Everything that deals with authentication",
      },
      {
        name: "users",
        description: "Everthing that deals with users",
      },
      {
        name: "property",
        description: "Everthing that deals with properties",
      },
      {
        name: "admin",
        description: "Everthing that deals with admin",
      },
    ],
    paths: {
      "/auth": {
        post: [
          { tags: "auth" },
          { description: "Signup a user" },
          { operationId: "userSignup" },
          {
            requestBody: {
              description: "Create a new user",
              content: {
                "application/json": {
                  schema: {
                    properties: {
                      first_name: {
                        type: String,
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
                    },
                  },
                },
              },
              //   required: true,
            },
          },
        ],
      },
    },
  },
  apis: ["./routes/auth.js"], // files containing annotations as above
};

export { options };
