import { Tournament } from './../models/tournament';
import { TournamentsService } from './../services/tournaments.service';
import express, { Router, Request, Response, Application } from 'express';
import { AuthService } from '../services/auth.service';
import { User } from 'src/models/user';

/**
 * Ce controller vous servira de modèle pour construire vos différent controller
 * Le controller est la partie de l'application qui est en charge de la reception
 * des requetes http.
 *
 * @param app l'application express
 */
export const TournamentsController = (app: Application) => {

  const router: Router = express.Router();
  const tournamentsService = TournamentsService.getInstance();
  const authService = AuthService.getInstance();

  /**
   * Return all tournaments in JSON
   */
  router.get('/', (req: Request, res: Response) => {
    tournamentsService.getAll().then(results => {
        res.send(results);
      })
      .catch(err => {
        console.log(err);
      })
  });

  /**
   * Return only one tournament in JSON relative to its id
   */
  router.get('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    tournamentsService.getById(id).then(result => {
        res.send(result);
      })
      .catch(err => {
        console.log(err);
      })
  });

  router.get('/users/:id', authService.verifyToken, (req: Request, res: Response) => {
    const tournamentId = parseInt(req.params.id);
    console.log(tournamentId)
    tournamentsService.getParticipant(tournamentId).then(results => {
      res.send(results);
    })
    .catch(err => {
      console.log(err);
    })
  });

  /**
   * Return all tournaments in JSON according to searchForm parameters
   */
  router.post('/search', (req: Request, res: Response) => {
    const searchForm: Tournament = req.body;

    tournamentsService.getBySearchForm(searchForm).then(result=> {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    })
  });

  /**
   * Return all tournaments in JSON according to searchForm parameters
   */
  router.post('/search/freeSlot', (req: Request, res: Response) => {
    const searchForm: Tournament = req.body;

    tournamentsService.getWithFreeSlot(searchForm).then(result=> {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    })
  });

  /**
   * Create a new tournament from a JSON body and return the created tournament in JSON.
   */
  router.post('/', (req: Request, res: Response) => {
    const tournament: Tournament = req.body; // Automatically transform in a Tournament object

    tournamentsService.create(tournament).then(result => {
        res.send(result);
      })
      .catch(err => {
        console.log(err);
      })
  });

  /**
   * Update a tournament relative to its id and return the updated tournament in JSON.
   */
  router.put('/:id', (req: Request, res: Response) => {
    const tournament: Tournament = req.body; // req.params.id is automatically set into the body

    tournamentsService.updateNbParticipant(tournament).then(result => {
        res.send(result);
      })
      .catch(err => {
        console.log(err);
      })
  });

  /**
   * Delete a tournament relative its id.
   */
  router.delete('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    tournamentsService.delete(id).then(result => {
        res.send();
      })
      .catch(err => {
        console.log(err);
      })
  });

  router.post('/inscription', authService.verifyToken, (req: Request, res: Response) => {
    const tournament: Tournament = req.body; // Automatically transform in a Post object
    const user: User = req.user;

    console.log(user)
    console.log(tournament)
        tournamentsService.createParticipant(req.user.id, tournament.id). then(result => {
          res.send(result);
        })
      .catch(err => {
        console.log(err);
      })
  });

  router.post('/upload-image', async (req, res) =>{
    try {
      if(!req.files) {
        res.send({
          status: false,
          message: 'No file uploaded'
        });
      } else {
        let image : any = req.files.image;
        console.log(req.files.image)
        console.log(image);

        image.mv('./uploads/' + image.name)

        res.send({
          status: true,
          message: 'File is uploaded',
          data: {
            name: image.name,
            mimetype: image.mimetype,
            size: image.size
          }
        });
      }
    } catch (err) {
      console.log(err)
      res.status(500).send(err);
    }
});

  app.use('/tournaments', router);
};
