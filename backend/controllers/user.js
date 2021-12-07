const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const passwordValidator = require('password-validator');  // Plugin password-validator
var Validation = new passwordValidator();
Validation
.is().min(4)                                    // Minimum length 4
.is().max(30)                                  // Maximum length 30
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                // Must have digits
.has().not().spaces();                           // Should not have spaces

const User = require('../models/User');
const Err = require('../models/Errors');   // Plugin Mongoose-errors

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)      //Hashage du password avec BCRYPT
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            if (Validation.validate(req.body.password)) {    //retourne TRUE si respecte les critéres de Validation
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({ error }));
            }else{
                var Reponse = Validation.validate(req.body.password, { details: true } );  //retourne les details des critéres de Validation non respecté
                var iteration = Reponse.length;
                var Message = "";
                for ( let i = 0; i < iteration ; i++){
                    Message = Message + "\n" + Reponse[i].message;
                };
                res.status(400).json({ message: "Mot de passe non valide !" + Message, Reponse});
            };
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !'});
            }
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ error: 'Mot de passe incorrect !'});
                }
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' }
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};