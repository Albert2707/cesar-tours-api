"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailController = void 0;
const resend_1 = require("resend");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
// import Email from "../email/Email";
// await resend.batch.send([
//   {
//     from: 'Acme <onboarding@resend.dev>',
//     to: ['foo@gmail.com'],
//     subject: 'hello world',
//     html: '<h1>it works!</h1>',
//   },
//   {
//     from: 'Acme <onboarding@resend.dev>',
//     to: ['bar@outlook.com'],
//     subject: 'world hello',
//     html: '<p>it works!</p>',
//   },
// ]);
class EmailController {
}
exports.EmailController = EmailController;
_a = EmailController;
EmailController.postSendEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const key = req.headers["resendapikey"];
        if (!key) {
            return res.status(401).json({ message: "Debe proporcinonar una clave de API" });
        }
        const { email, name, message, html } = req.body;
        if (!email || !name || !message || !html) {
            return res.status(400).json({ message: "Favor enviar todos los datos" });
        }
        const resend = new resend_1.Resend(key);
        const { data, error } = yield resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            // from: "Acme <albertjohan2707@albertdev.dev>",
            to: [email],
            subject: "hello" + name,
            html,
        });
        if (error) {
            return res.status(400).json({ error });
        }
        return res.status(200).json({ data, message: "Correo enviado con exito" });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Error al enviar correo", error: error.message });
        }
    }
});
