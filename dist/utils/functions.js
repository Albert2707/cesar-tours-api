"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatToDatabaseDate = exports.formatDate = void 0;
const date_fns_1 = require("date-fns");
const formatDate = (dateString) => {
    if (!dateString)
        return null;
    const date = (0, date_fns_1.parseISO)(dateString);
    if (isNaN(date.getTime())) {
        console.error("Invalid date provided:", dateString);
        return null;
    }
    return (0, date_fns_1.format)(date, 'yyyy-MM-dd');
};
exports.formatDate = formatDate;
const formatToDatabaseDate = (date) => {
    const parsedDate = (0, date_fns_1.parseISO)(date);
    return (0, date_fns_1.format)(parsedDate, 'yyyy-MM-dd');
};
exports.formatToDatabaseDate = formatToDatabaseDate;
