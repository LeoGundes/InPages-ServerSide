const express = require('express');
const { listarReviews, criarReview } = require('../controllers/Reviews');
const router = express.Router();

// GET /reviews?livroId=ID  (opcional)
router.get('/', listarReviews);

// POST /reviews
router.post('/', criarReview);

module.exports = router;
