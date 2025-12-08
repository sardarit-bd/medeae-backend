import Tesseract from "tesseract.js";
import PrescriptionItem from "../../models/PrescriptionItem.js";
import OpenAiMEdicianExtract from "../../utils/OpenAiMEdicianExtract.js";
import uEmailandIdfinder from "../../utils/uEmailandIdfinder.js";



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


        const email = uEmailandIdfinder(req, 'email');
        const userId = uEmailandIdfinder(req, 'id');




        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Use Tesseract.js to extract text from image
        const buffer = req.file.buffer;

        const { data: { text } } = await Tesseract.recognize(buffer, "eng");


        // TODO: parse text to extract medication names, dosages, etc.
        // Example: simple regex or NLP parser
        const medications = parseMedicationsFromText(text);




        const finalResult = await OpenAiMEdicianExtract(medications);


        //save into the database 
        const saveItems = finalResult.map(item => ({
            userId: userId,
            medicine: item.medicine,
            schedule: item.schedule,
            source: "ocr"
        }));

        await PrescriptionItem?.insertMany(saveItems);


        res.json({
            success: true,
            message: "OCR processing successful",
            data: finalResult
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

