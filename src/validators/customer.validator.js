import expressValidator from 'express-validator';
const { body } = expressValidator;

import { PLANET_NAMES } from '../data/constants.js';

class CustomerValidators {

    partial(){

        return [
            body('planet').optional()
                .isIn(PLANET_NAMES).withMessage('Doit etre dans le tableau de constante planètes'),
            body('coord.lat').optional()
                .isFloat({min:-1000,max:1000}).withMessage('la latitude doit etre entre -1000 et 1000'),
            body('coord.lon').optional()
                .isFloat({min:-1000,max:1000}).withMessage('la longitude doit etre entre -1000 et 1000'),
            body('birthday').optional()
                .isISO8601().withMessage('Doit etre une date').bail()
                .isBefore(new Date().toISOString()).withMessage('Doit etre dans le passer'),
        ];

    }

    complete(){
        return [
            body('name').exists().withMessage('le nom est requis'),
            body('email').exists().withMessage('le courriel est requis'),
            body('planet').exists().withMessage('la planète est requise'),
            body('coord.lat').exists().withMessage('la latitude est requise'),
            body('coord.lon').exists().withMessage('la longitude est requise'),
            body('phone').exists().withMessage('le numero de telephone est requis'),
            body('birthday').exists().withMessage('la date de naissance est requise'),
            ... this.partial(),
        ]
    }


}

export default new CustomerValidators();