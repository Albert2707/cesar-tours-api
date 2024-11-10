"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateKey = void 0;
const validateKey = (req, res, next) => {
    const key = req.headers["resendapikey"];
    if (!key) {
        res.status(401).json({ message: "Debe proporcinonar una clave de API" });
        return;
    }
    next();
};
exports.validateKey = validateKey;
