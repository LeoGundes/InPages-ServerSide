const { getAllReviews, getReviewsByBookId, addReview } = require('../services/Reviews');

function listarReviews(req, res) {
  const { livroId } = req.query;
  try {
    if (livroId) {
      const reviews = getReviewsByBookId(livroId);
      return res.json(reviews);
    }
    const reviews = getAllReviews();
    res.json(reviews);
  } catch (err) {
    res.status(500).send('Erro ao buscar reviews');
  }
}

function criarReview(req, res) {
  const { livroId, usuario, texto, nota } = req.body;
  if (!livroId || !usuario || !texto || !nota) {
    return res.status(400).send('Campos obrigatórios: livroId, usuario, texto, nota');
  }
  try {
    const review = addReview({ livroId, usuario, texto, nota });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).send('Erro ao criar review');
  }
}

module.exports = {
  listarReviews,
  criarReview
};
