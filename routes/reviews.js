const express = require('express');
//mergeParams: true allows to pull the id from app.js (app.use('/posts/:id/reviews', reviewsRouter);)
const router = express.Router({ mergeParams: true });
const { asyncErrorHandler, isReviewAuthor } = require('../middleware/index');
const {
    reviewCreate,
    reviewUpdate,
    reviewDestroy
} = require('../controllers/reviews');

// POST reviews create 
router.post('/', asyncErrorHandler(reviewCreate));

// PUT reviews update /posts/:id/reviews/:review_id
router.put('/:review_id', isReviewAuthor, asyncErrorHandler(reviewUpdate));

// DELETE reviews destroy /posts/:id/reviews/:review_id
router.delete('/:review_id', (req, res, next) => {
    res.send(' DELETE /posts/:id/reviews/:review_id');
});


module.exports = router;
