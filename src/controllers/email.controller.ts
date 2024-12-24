import { NextFunction, Request, Response } from "express"
import { Resend } from "resend";
import { config } from "dotenv";

config();
interface EmailProps {
    email: string,
    name: string,
    message: string
    html: string
    subject: string
}

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
                from: "Cesar Tours <onboarding@resend.dev>",
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

    static sendConfirmationEmail = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const key = req.headers["resendapikey"] as string
            const { html, subject, email } = req.body;
            const resend = new Resend(key);
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
                return next(error)
            }
            return res.status(200).json({ data, message: "Correo enviado con exito" });

        } catch (error) {
            next(error)
        }
    }
}