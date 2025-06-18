const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/list/:listId', ratingController.getListRatings);
router.get('/list/:listId/average', ratingController.getListAverageRating);
router.post('/list/:listId', ratingController.rateList);

router.put('/:id', ratingController.updateRating);
router.delete('/:id', ratingController.deleteRating);

module.exports = router; 