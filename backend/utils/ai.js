const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000/api';

const analyzeWeaknesses = async (studyData) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/weakness-analysis`, {
            data: studyData
        });
        return response.data;
    } catch (error) {
        console.error('Error calling AI service:', error.message);
        return {
            error: 'AI service unavailable',
            weaknesses: [],
            overall_status: 'Error'
        };
    }
};

module.exports = { analyzeWeaknesses };
