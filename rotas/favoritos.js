const { Router } = require('express'); 
const { getFavoritos, postFavorito, deleteFavorito } = require('../controllers/favoritos') ;

const router = Router();

router.get('/', getFavoritos);
router.post('/:id', postFavorito);
router.delete('/:email/favoritos/:id', deleteFavorito);

module.exports = router;
