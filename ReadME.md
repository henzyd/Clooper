# Uchechukwu Henry Anachuna Clooper Project

Hi there 👋, this is Property Manager API built with ExpressJS, Typescript and Mongoose

## All Endpoints

**Welcome path**

- https://henzyd-clooper.onrender.com/api/v1

**Users path**

- https://henzyd-clooper.onrender.com/api/v1/auth/signup --> `POST` Sign up
- https://henzyd-clooper.onrender.com/api/v1/auth/login --> `POST` Login
- https://henzyd-clooper.onrender.com/api/v1/users --> `GET` Getting all users
- https://henzyd-clooper.onrender.com/api/v1/users/:id --> `GET` Getting a user

**Admin path**
Admin paths are encrypted with the SHA256 hashing algorithm to prevent malicious access to the admin.
When an admin wants to signup themselves they will recieve an email containing the path to the admin endpoint, it is this way because I won't want a radom user to be able figure out where the admin endpoint is located.

This is what the path will look like:

- https://henzyd-clooper.onrender.com/api/v1/auth/4b6235b7f57db8e43048d263788791b652e29127d05b998fcc85934f03bfd296/admin-signup --> `POST` Create an admin
- https://henzyd-clooper.onrender.com/api/v1/auth/4b6235b7f57db8e43048d263788791b652e29127d05b998fcc85934f03bfd296/admin-login --> `POST` Login for an admin
- https://henzyd-clooper.onrender.com/api/v1/auth/4b6235b7f57db8e43048d263788791b652e29127d05b998fcc85934f03bfd296/property --> `POST` Get all property
- https://henzyd-clooper.onrender.com/api/v1/auth/4b6235b7f57db8e43048d263788791b652e29127d05b998fcc85934f03bfd296/publish-property/:id --> `POST` Publush and Unpublish a property
- https://henzyd-clooper.onrender.com/api/v1/auth/4b6235b7f57db8e43048d263788791b652e29127d05b998fcc85934f03bfd296/user-active/:id --> `POST` Activate or Deactivate a user

**Property path**

- https://henzyd-clooper.onrender.com/api/v1/property --> `GET` Get all properties
- https://henzyd-clooper.onrender.com/api/v1/property --> `POST` Create a property
- https://henzyd-clooper.onrender.com/api/v1/property/:id --> `GET` Get a property
- https://henzyd-clooper.onrender.com/api/v1/property/:id --> `UPDATE` Update a property
- https://henzyd-clooper.onrender.com/api/v1/property/:id --> `DELETE` Delete a property
