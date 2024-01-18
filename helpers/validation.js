const moment = require('moment');
const isValidDatePresented = (dateFromDocument, res) => {

    const isValidDatePresented = moment(dateFromDocument, 'MMM YYYY').isValid()
    if (!isValidDatePresented) {
        return res.status(400).json({ error: 'Invalid structure of file. Date is invalid' });

    };
};

const validateMandatoryFields = (data, mandatoryFields, res) => {
    const missingFields = mandatoryFields.filter(field => !data.includes(field));

    if (missingFields.length > 0) {
        const errorMessage = `Missing mandatory fields: ${missingFields.join(', ')}`;
        return res.status(400).json({ error: errorMessage });
    }

    return { valid: true };
};

const validateDate = (invoicingMonth, formattedDateFromDoucument, res) => {
    if (invoicingMonth !== formattedDateFromDoucument) {
        // Send an error response if not the same
        return res.status(400).json({ error: 'InvoicingMonth does not match the document date.' });
    }
}

module.exports = { isValidDatePresented, validateMandatoryFields, validateDate }