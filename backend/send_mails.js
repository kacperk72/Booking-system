require('dotenv').config();
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASSWORD
    }
});


let Mail = {
    sendConfirmationMail: function (target, acceptationState) {
        Mail.mailOptions.to = target
        Mail.mailOptions.text = `stan rezerwacji zmieniony na ${acceptationState}`
        transporter.sendMail(Mail.mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    },

    sendReservationPendingMail: function (){
        Mail.mailOptions.to = process.env.ADMIN_MAIL
        Mail.mailOptions.subject = 'Nowa rezerwacja czeka na potwierdzenie'
        Mail.mailOptions.text = 'Sprawdź nową rezerwację'
        transporter.sendMail(Mail.mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    },

    mailOptions: {
        from: process.env.MAIL, // sender address
        to: '', // list of receivers
        subject: 'Potwierdzenie rezerwacji', // Subject line
        text: '', // plain text body
        html: '' // html body
    }

};

module.exports = Mail