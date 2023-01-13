import { Types } from "mongoose";
import nodemailer from "nodemailer";
import { PropertyModelType, UserModelType } from "../db/models.js";

function emailMessage(
  data: PropertyModelType,
  dataOwner: UserModelType,
  propertyID: Types.ObjectId,
  ownerID: Types.ObjectId
) {
  const emailHtml = `
  <div>
    <h4>A property has been created by id ${propertyID}, if you wish to publish this propety click the link below</h4>
    <a style="padding-bottom: 20px;" href="http://localhost:3020/api/v1/${
      process.env.ADMIN_HASH_ROUTE
    }/publish-property/${propertyID}">Publish Property</a>

    <h3 style="padding-bottom: 10px;">Details of the property are below:</h3>
    <p><span style="font-weight: 700;">Owner ID:</span> ${ownerID}</p>
    <p><span style="font-weight: 700;">Owner Full Name:</span> ${
      dataOwner.first_name
    } ${dataOwner.last_name}</p>
    <p><span style="font-weight: 700;">Owner Email:</span> ${
      dataOwner.email
    }</p>
    <p><span style="font-weight: 700;">Owner Phone:</span> ${
      dataOwner.phone
    }</p>
    <div style="padding-left: 20px;">
      <p><span style="font-weight: 700;">Name of Property:</span> ${
        data.name
      }</p>
      <p><span style="font-weight: 700;">ID:</span> ${propertyID} </p>
      <p><span style="font-weight: 700;">Address:</span> ${data.address}</p>
      <p><span style="font-weight: 700;">Type:</span> ${data.type} </p>
      <p><span style="font-weight: 700;">Description:</span> ${
        data.description
      } </p>
      <p><span style="font-weight: 700;">Slug:</span> ${data.slug} </p>
      <div>
        <p>Image URLs</p>
        <p>${data.image_url}</p>
        <div style="padding-left: 10px;">
          ${data.image_url.forEach((image) => {
            console.log(image);
            `<a href=${image}>${image}</a>`;
          })}
        </div>
      </div>
        
      <p><span style="font-weight: 700;">Total rooms:</span> ${
        data.total_rooms
      } </p>
      <p><span style="font-weight: 700;">Occupancy type:</span> ${
        data.occupancy_type
      } </p>
      <p><span style="font-weight: 700;">Rent amount:</span> ${
        data.rent_amount
      } </p>
      <p><span style="font-weight: 700;">Rent frequency:</span> ${
        data.rent_frequency
      } </p>
      <p><span style="font-weight: 700;">Is published:</span> ${
        data.is_published
      } </p>
      <p><span style="font-weight: 700;">Created at:</span> ${
        data.created_at
      } </p>
      <p><span style="font-weight: 700;">Updated at:</span> ${
        data.updated_at
      } </p>
    </div>
  </div>  
    `;
  console.log(emailHtml);

  return emailHtml;
}

async function sendNotificationEmail(
  email: string,
  data: PropertyModelType,
  dataOwner: any,
  propertyID: Types.ObjectId,
  ownerID: Types.ObjectId
) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: `${email}`,
    subject: `A property was created by a user`,
    html: emailMessage(data, dataOwner, propertyID, ownerID),
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return error.message;
    } else {
      console.log("Email sent: " + info.response);
      return info.response;
    }
  });
}

export { sendNotificationEmail };
