import expressValidator from 'express-validator';
const { body } = expressValidator;

class OrderValidators {

    partial(){

        return [
            body('discoveryDate').optional()
                .isISO8601().withMessage('Doit etre une date').bail()
                .isBefore(new Date().toISOString()).withMessage('Doit etre dans le passer'),
            body('temperature').optional()
                .isNumeric().withMessage('la valeur doit etre numerique'),
            body('satellites').optional()
                .isArray().isin('doivent etre une collection'),
            body('position.x').optional()
                .isFloat({min:-1000,max:1000}).withMessage('la position de x doit etre entre -1000 et 1000'),
            body('position.y').optional()
                .isFloat({min:-1000,max:1000}).withMessage('la position de y doit etre entre -1000 et 1000'),
            body('position.z').optional()
                .isFloat({min:-1000,max:1000}).withMessage('la position de z doit etre entre -1000 et 1000')
        ];

    }

    complete(){
        return [
            body('name').exists().withMessage('le nom est requis'),
            body('discoveryDate').exists().withMessage('la date est requis'),
            body('temperature').exists().withMessage('la temperature est requise'),
            body('position.x').exists().withMessage('la position de x est requise'),
            body('position.y').exists().withMessage('la position de y est requise'),
            body('position.z').exists().withMessage('la position de z est requise'),
            ... this.partial(),
        ]
    }


}

export default new OrderValidators();