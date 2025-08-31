"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailController = void 0;
const resend_1 = require("resend");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
class EmailController {
}
exports.EmailController = EmailController;
_a = EmailController;
EmailController.postSendEmail = async (req, res, next) => {
    try {
        const key = req.headers["resendapikey"];
        if (!key) {
            return res.status(401).json({ message: "Debe proporcinonar una clave de API" });
        }
        const { email, name, message, html, subject } = req.body;
        if (!email || !name || !message || !html) {
            return res.status(400).json({ message: "Favor enviar todos los datos" });
        }
        const resend = new resend_1.Resend(key);
        const { data, error } = await resend.emails.send({
            from: "Cesar Tours <onboarding@resend.dev>",
            to: 'albertjohan2707@gmail.com',
            subject,
            html,
        });
        if (error) {
            return res.status(400).json({ error });
        }
        return res.status(200).json({ data, message: "Correo enviado con exito" });
    }
    catch (error) {
        next(error);
    }
};
EmailController.sendConfirmationEmail = async (req, res, next) => {
    try {
        const key = req.headers["resendapikey"];
        const { html, subject, email } = req.body;
        const resend = new resend_1.Resend(key);
        const { data, error } = await resend.batch.send([
            {
                from: 'Cesar Tours <onboarding@resend.dev>',
                to: 'albertjohan2707@gmail.com',
                subject: subject[0],
                html: html[0],
            },
            {
                from: 'Cesar Tours <onboarding@resend.dev>',
                to: email,
                subject: subject[1],
                html: html[1],
            },
        ]);
        if (error) {
            return next(error);
        }
        return res.status(200).json({ data, message: "Correo enviado con exito" });
    }
    catch (error) {
        next(error);
    }
};
