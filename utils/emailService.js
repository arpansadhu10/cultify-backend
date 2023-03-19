import AWS from 'aws-sdk';
import nodemailer from 'nodemailer';


// interface SendMailFunction {
//   from: string;
//   to: string;
//   subject: string;
//   text: string;
//   html: string;
// }

const SESConfig = {
    apiVersion: '2010-12-01',
    accessKeyId: process.env.AWS_SES_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_SES_REGION,
};

const ses = new AWS.SES(SESConfig);
class EmailService {
    static async sendMail(args) {
        const isProduction = process.env.NODE_ENV === 'production';

        // if (isProduction) {
        //     return this.sendMailViaAWS(args);
        // }

        return this.sendMailViaMailtrap(args);
    }

    static async sendMailViaAWS({ from, to, subject, html }) {
        const params = {
            Source: from,
            Destination: {
                ToAddresses: [to],
            },
            ReplyToAddresses: [String(process.env.AWS_SES_EMAIL)],
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: html,
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: subject,
                },
            },
        };

        const info = await ses.sendEmail(params).promise();
        console.info(`Message sent via AWS SES: ${info.MessageId}`);
    }

    static async sendMailViaMailtrap({
        from,
        to,
        subject,
        text,
        html,
    }) {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const info = await transporter.sendMail({
            from,
            to,
            subject,
            text,
            html,
        });

        console.info(`Message sent via mailtrap: ${info.messageId}`);
    }
}

export default EmailService;
