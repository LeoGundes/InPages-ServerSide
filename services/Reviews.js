const fs = require('fs');
const path = require('path');
const reviewsPath = path.resolve(__dirname, '../reviews.json');

function getAllReviews() {
  return JSON.parse(fs.readFileSync(reviewsPath));
}

function getReviewsByBookId(livroId) {
  const reviews = getAllReviews();
  return reviews.filter(r => r.livroId === livroId);
}

function addReview({ livroId, usuario, texto, nota }) {
  const reviews = getAllReviews();
  const novaReview = {
    id: Date.now().toString(),
    livroId,
    usuario,
    texto,
    nota,
    data: new Date().toISOString()
  };
  reviews.push(novaReview);
  fs.writeFileSync(reviewsPath, JSON.stringify(reviews, null, 2));
  return novaReview;
}

module.exports = {
  getAllReviews,
  getReviewsByBookId,
  addReview
};
