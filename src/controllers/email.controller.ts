import { NextFunction, Request, Response } from "express"
import { Resend } from "resend";
import { config } from "dotenv";

config();
interface EmailProps {
    email: string,
    name: string,
    message: string
    html: string
    subject:string
}
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
export class EmailController {
    static postSendEmail = async (req: Request<{}, {}, EmailProps>, res: Response, next: NextFunction): Promise<any> => {
        try {
            const key = req.headers["resendapikey"] as string
            if (!key) {
                return res.status(401).json({ message: "Debe proporcinonar una clave de API" })
            }
            const { email, name, message, html, subject } = req.body;
            if (!email || !name || !message || !html) {
                return res.status(400).json({ message: "Favor enviar todos los datos" })
            }
            const resend = new Resend(key);
            const { data, error } = await resend.emails.send({
                from: "Acme <onboarding@resend.dev>",
                // from: "Acme <albertjohan2707@albertdev.dev>",
                to: 'albertjohan2707@gmail.com',
                subject,
                html,
            });

            if (error) {
                return res.status(400).json({ error });
            }
            return res.status(200).json({ data, message: "Correo enviado con exito" });
        } catch (error) {
          next(error)
        }
    }
}