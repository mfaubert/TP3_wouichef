import Exploration from '../models/exploration.model.js';
import planetRepository from '../repositories/planet.repository.js';
import Planet from '../repositories/planet.repository.js';

class ExplorationsRepository {

    retrieveAll(retrieveOptions){
        const retrieveQuery = Exploration.find()
                .skip(retrieveOptions.skip).limit(retrieveOptions.limit)
                .sort('-explorationDate');
        const countQuery = Exploration.countDocuments();

        return Promise.all([retrieveQuery, countQuery]);
    }
    
    retrieveById(idExploration, retrieveOptions) {
        const retrieveQuery = Exploration.findById(idExploration);

        if(retrieveOptions.planet){
            retrieveQuery.populate('planet');
        }

        return retrieveQuery;
    }

    transform(exploration, transformOptions = {}) {
        
        if(transformOptions.embed && transformOptions.embed.planet){
            exploration.planet = planetRepository.transform(exploration.planet, transformOptions);
        }else{
            exploration.planet = {href:`${process.env.BASE_URL}/planets/${exploration.planet}`};
        }
        exploration.href = `${process.env.BASE_URL}/explorations/${exploration._id}`;

        delete exploration._id;

        return exploration;
    }


}

export default new ExplorationsRepository();