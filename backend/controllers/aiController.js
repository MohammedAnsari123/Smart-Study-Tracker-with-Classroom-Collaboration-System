const pdf = require('pdf-parse');
const axios = require('axios');

const extractTextFromPDF = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const dataBuffer = req.file.buffer;
        if (!dataBuffer) {
            throw new Error('File buffer is empty');
        }

        // With pdf-parse@1.1.1, the package is a function
        const data = await pdf(dataBuffer);

        // Limit text length to avoid overloading LLM context
        const extractedText = data.text ? data.text.substring(0, 10000) : '';

        res.json({
            text: extractedText,
            pageCount: data.numpages,
            info: data.info
        });
    } catch (error) {
        console.error('PDF Extraction Error:', error);
        res.status(500).json({ message: `Failed to extract text from PDF: ${error.message}` });
    }
};

const generateTest = async (req, res) => {
    try {
        const { subject, topic, subtopic, durationMinutes, notes } = req.body;
        
        // Dynamically point to the python service (typically driven by env in prod)
        // Default to port 8000/api to match utils/ai.js config
        const pyAIUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000/api';
        
        const fetchResponse = await axios.post(`${pyAIUrl}/test/generate`, {
            subject, topic, subtopic, durationMinutes, notes
        });
        
        res.json(fetchResponse.data);
    } catch (error) {
        console.error('Test Generation Error:', error);
        res.status(500).json({ message: `Failed to generate test: ${error.message}` });
    }
}

module.exports = { extractTextFromPDF, generateTest };
