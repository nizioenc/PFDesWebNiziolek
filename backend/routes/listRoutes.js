const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', listController.getLists);
router.get('/public', listController.getPublicLists);
router.get('/public/:id', listController.getPublicList);
router.get('/:id', listController.getList);
router.post('/', listController.createList);
router.put('/:id', listController.updateList);
router.put('/:id/toggle-public', listController.togglePublic);
router.delete('/:id', listController.deleteList);

module.exports = router; 