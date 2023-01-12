import nodemailer from "nodemailer";
import { PropertyModelType, UserModelType } from "../db/models.js";

function emailMessage(
  data: PropertyModelType,
  dataOwner: UserModelType,
  propertyID: string,
  ownerID: string
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
      <p>Name of Property: ${data.name}</p>
      <p>ID: ${propertyID} </p>
      <p>Address: ${data.address}</p>
      <p>Type: ${data.type} </p>
      <p>Description: ${data.description} </p>
      <p>Slug: ${data.slug} </p>
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
        
      <p> Total rooms: ${data.total_rooms} </p>
      <p> Occupancy type: ${data.occupancy_type} </p>
      <p> Rent amount: ${data.rent_amount} </p>
      <p> Rent frequency: ${data.rent_frequency} </p>
      <p> Is published: ${data.is_published} </p>
      <p> Created at: ${data.created_at} </p>
      <p> Updated at: ${data.updated_at} </p>
    </div>
  </div>  
    `;
  console.log(emailHtml);

  return emailHtml;
}

async function sendNotificationEmail(
  email: string,
  data: PropertyModelType,
  dataOwner: UserModelType,
  propertyID: string,
  ownerID: string
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
