const express = require('express');
const multer = require('multer');
const path = require('path');
const XLSX = require('xlsx');

const app = express();
const port = 3000;


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'upload.html'));
});


app.post('/upload', upload.single('file'), (req, res) => {
    try {
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });

        const importRange = 'A2:F4'; //range for getting currency from file
        const headers = 1; //range for getting currency from file
        let worksheetsForCurrency = {};
        const curency = {};
        for (const sheetName of workbook.SheetNames) {
            worksheetsForCurrency[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
                range: importRange,
                header: headers,
            });
        }
        worksheetsForCurrency.Sheet1.forEach((item) => {
            curency[item[0]] = item[1];
        });

        let worksheetsForInvoice = {};
        for (const sheetName of workbook.SheetNames) {
            worksheetsForInvoice[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { range: 4 });
        }
        const dataForInvoces = worksheetsForInvoice.Sheet1;

        // Function to validate an array of invoices
        function validateInvoces(invoices) {
            const mandatoryKeys = [
                'Customer',
                "Cust No'",
                'Project Type',
                '# Hours',
                'Hour Price',
                'Hourly Price Currency',
                'Total',
                'Invoice Currency',
                'Status',
            ];

            invoices.forEach((invoice) => {
                // When no validation errors - keep validationErrors empty - so i add array by default
                invoice.validationErrors = [];
                // Check if all mandatory keys are present in the object
                const missingKeys = mandatoryKeys.filter((key) => !(key in invoice));

                // If any mandatory key is missing, add a validation error to the object
                if (missingKeys.length > 0) {
                    invoice.validationErrors.push(`Missing mandatory keys: ${missingKeys.join(', ')}`);
                }
            });

            // Return the array of objects with validation errors added
            return invoices;
        }

        const validatedInvoices = validateInvoces(dataForInvoces);

        const finalResultOfTask = {
            InvoicingMonth: 'mocked',
            currencyRates: curency,
            invoicesData: validatedInvoices,
        };
        res.status(200).json(finalResultOfTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
