const ChatConversation = require('../models/ChatConversation');

// Get all conversations for the user (titles only, no messages)
const getUserConversations = async (req, res) => {
    try {
        const conversations = await ChatConversation.find({ userId: req.user._id })
            .select('title createdAt updatedAt pdfName')
            .sort('-updatedAt');
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single conversation with all messages
const getConversation = async (req, res) => {
    try {
        const conversation = await ChatConversation.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        res.json(conversation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new conversation
const createConversation = async (req, res) => {
    try {
        const { title, messages, pdfName } = req.body;

        const conversation = await ChatConversation.create({
            userId: req.user._id,
            title: title || 'New Chat',
            messages: messages || [],
            pdfName: pdfName || ''
        });

        res.status(201).json(conversation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a message to an existing conversation
const addMessage = async (req, res) => {
    try {
        const { role, content } = req.body;

        const conversation = await ChatConversation.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { 
                $push: { messages: { role, content } },
                $set: { updatedAt: new Date() }
            },
            { new: true }
        );

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        res.json(conversation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update conversation title
const updateConversationTitle = async (req, res) => {
    try {
        const { title } = req.body;

        const conversation = await ChatConversation.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { title },
            { new: true }
        );

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        res.json(conversation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a conversation
const deleteConversation = async (req, res) => {
    try {
        const conversation = await ChatConversation.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        res.json({ message: 'Conversation deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUserConversations,
    getConversation,
    createConversation,
    addMessage,
    updateConversationTitle,
    deleteConversation
};
