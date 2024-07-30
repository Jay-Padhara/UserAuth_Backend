const MailTemplate = (otp, recipientName) =>
  `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            color: #333333;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .content p {
            margin: 10px 0;
            color: #555555;
        }
        .otp {
            display: inline-block;
            padding: 10px 20px;
            font-size: 24px;
            letter-spacing: 2px;
            background-color: #f9f9f9;
            border: 1px solid #dddddd;
            border-radius: 5px;
            color: #333333;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
        }
        .footer p {
            margin: 5px 0;
            color: #777777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome, ${recipientName}!</h1>
        </div>
        <div class="content">
            <p>We received a request to access your account. Please use the following One Time Password (OTP) to proceed:</p>
            <div class="otp">${otp}</div>
            <p>This OTP is valid for 10 minutes.</p>
            <p>Thank you for using our service!</p>
        </div>
        <div class="footer">
            <p>Best Regards,</p>
            <p>Jay Padmareddy</p>
        </div>
    </div>
</body>
</html>
`;

module.exports = MailTemplate;
