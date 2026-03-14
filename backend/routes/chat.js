const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getUserConversations,
    getConversation,
    createConversation,
    addMessage,
    updateConversationTitle,
    deleteConversation
} = require('../controllers/chatController');

router.get('/', protect, getUserConversations);
router.get('/:id', protect, getConversation);
router.post('/', protect, createConversation);
router.post('/:id/message', protect, addMessage);
router.patch('/:id/title', protect, updateConversationTitle);
router.delete('/:id', protect, deleteConversation);

module.exports = router;
