import Tesseract from "tesseract.js";






// Example parser function (simplified)
function parseMedicationsFromText(text) {
    // This is a very basic example; in real app use NLP / regex
    const lines = text.split("\n");
    return lines
        .map(line => line.trim())
        .filter(line => line.length > 0 && line.match(/[a-zA-Z]/));
}


// create patient ocr OCR integration to import medication from prescriptions
const patientocr = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Use Tesseract.js to extract text from image
        const buffer = req.file.buffer;

        const { data: { text } } = await Tesseract.recognize(buffer, "eng");


        // TODO: parse text to extract medication names, dosages, etc.
        // Example: simple regex or NLP parser
        const medications = parseMedicationsFromText(text);

        res.json({
            success: true,
            medications,
            rawText: text,
        });
    } catch (error) {
        console.error("Patient OCR Error:", error);
        res.status(500).json({ success: false, message: "OCR processing failed" });
    }
};



/*********** modules export from here ************/
export {
    patientocr
};

