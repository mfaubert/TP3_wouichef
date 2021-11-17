import expressValidator from 'express-validator';
const { body } = expressValidator;

import { PLANET_NAMES, MONSTER_ANCESTORS, PIZZA_TOPPINGS } from '../data/constants.js';

class CustomerValidators {

    partial(){

        return [
            body('planet').optional()
                .isin(PLANET_NAMES).withMessage('Doit etre dans le tableau de constantes'),
            body('coord.lat').optional()
                .isFloat({min:-1000,max:1000}).withMessage('la latitude doit etre entre -1000 et 1000'),
            body('coord.lon').optional()
                .isFloat({min:-1000,max:1000}).withMessage('la longitude doit etre entre -1000 et 1000'),
            body('chef.ancestor').optional()
                .isin(MONSTER_ANCESTORS).withMessage('Doit etre dans le tableau de constantes'),
            body('chef.speciality').optional()
                .isin(PIZZA_TOPPINGS).withMessage('Doit etre dans le tableau de constantes'),

        ];

    }

    complete(){
        return [
            body('planet').exists().withMessage('la planet est requis'),
            body('coord.lat').exists().withMessage('la latitude est requise'),
            body('coord.lon').exists().withMessage('la longitude est requise'),
            body('chef.name').exists().withMessage('le nom du chef est requis'),
            body('chef.ancestor').exists().withMessage('l\'ancêtre du chef est requis'),
            body('chef.speciality').exists().withMessage('la specialite du chef est requise'),
            ... this.partial(),
        ]
    }


}

export default new PlanetValidators();