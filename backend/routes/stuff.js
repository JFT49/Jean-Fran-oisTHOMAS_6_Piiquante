const auth = require('../middleware/auth');                 //middleware de verification du token user
const multer = require('../middleware/multer-config');      //MULTER : package qui nous permet de gérer les fichiers entrants dans les requêtes HTTP

const express = require('express');
const router = express.Router();

const stuffCtrl = require('../controllers/stuff');

router.post('/', auth, multer, stuffCtrl.createSauce);      //CRUD : Create
router.get('/:id', auth, stuffCtrl.getOneSauce);            //CRUD : Read
router.get('/', auth, stuffCtrl.getAllSauces);
router.put('/:id', auth, multer, stuffCtrl.modifySauce);    //CRUD : Update
router.delete('/:id', auth, stuffCtrl.deleteSauce);         //CRUD : Delete
router.post('/:id/like', auth, stuffCtrl.likeSauce);

module.exports = router;