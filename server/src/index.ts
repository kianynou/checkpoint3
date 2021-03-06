import express from 'express';
import loaders from './loaders';
import { TournamentsController } from './controller/tournaments.controller';
import { PostsController } from './controller/posts.controller';
import { AuthController } from './controller/auth.controller';
import { UsersController } from './controller/users.controller';

async function startServer() {
    // Récupération de l'application initiale
    const app = express();

    // Chargement des différent loader
    await loaders(app);

    // Ajout des différentes route de votre application
    PostsController(app);
    TournamentsController(app);
    AuthController(app);
    UsersController(app);

    // Démarrage du serveur une fois que tout est correctement init
    app.listen(3000, () => console.log('Express server  is running'));
  }

startServer();
