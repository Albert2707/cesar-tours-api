import { NextFunction, Request, Response } from "express"
import { Resend } from "resend";
import { config } from "dotenv";

config();
interface EmailProps {
    email: string,
    name: string,
    message: string
    html: string
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
            const { email, name, message, html } = req.body;
            console.log(req.body)
            if (!email || !name || !message || !html) {
                return res.status(400).json({ message: "Favor enviar todos los datos" })
            }
            const resend = new Resend(key);
            const { data, error } = await resend.emails.send({
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
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ message: "Error al enviar correo", error: error.message });
            }
        }
    }
}