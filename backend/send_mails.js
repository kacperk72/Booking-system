require('dotenv').config();
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASSWORD
    }
});

const Mail = {
    sendConfirmationMail(target, acceptationState) {
        Mail.Options.to = target
        Mail.Options.text = `stan rezerwacji zmieniony na ${acceptationState}`
        transporter.sendMail(Mail.Options, (error, info) => {
            if (error) console.error(error);
            else console.log(`Email sent: ${info.response}`);
        });
    },

    sendReservationPendingMail() {
        Mail.Options.to = process.env.ADMIN_MAIL
        Mail.Options.subject = 'Nowa rezerwacja'
        Mail.Options.text = 'Sprawdź nową rezerwację'
        transporter.sendMail(Mail.Options, (error, info) => {
            if (error) console.error(error);
            else console.log(`Email sent: ${info.response}`);
        });
    },

    Options: {
        from: process.env.MAIL, // sender address
        to: '', // list of receivers
        subject: 'Potwierdzenie rezerwacji', // Subject line
        text: '', // plain text body
        html: '' // html body
    }
};

module.exports = Mail