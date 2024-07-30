const mail = require("nodemailer");
const mailTemplate = require("./MailTemplate");

const transporter = mail.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "jaypadhara@gmail.com",
    pass: "nglv nnkk lury cdmd",
  },
});

const mailSender = async (to, otp, recipientName) => {
  try {
    const info = await transporter.sendMail({
      from: "soboke <sobokel222@cartep.com>",
      to: to,
      subject: "Email verification",
      html: mailTemplate(otp, recipientName),
    });

    console.log("Email sent successfully:", info.messageId, "to: ", to);
  } catch (error) {
    console.log(error);
  }
};

module.exports = mailSender;
