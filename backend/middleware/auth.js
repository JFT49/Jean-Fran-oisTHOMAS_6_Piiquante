require('dotenv').config();         //DOTENV : pour le gestion des variables d'environneemnts
const jwt = require('jsonwebtoken');    //JSONWEBTOKEN : gestion token d'identification

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];          //Bearer token >>>> on split pour garder que le token
        const decodedToken = jwt.verify(token, process.env.TOKEN_VERIFY);     //Variable d'environnement définit dans le .env de DOTENV (.env à mettre dans gitignore)
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !';
        } else {
            next();
        }
    } catch (error) {
        res.status(403).json({ error: '403: unauthorized request.'});
    }
};