import { User } from './../models/user';
import { AuthService } from './../services/auth.service';
import express, { Router, Request, Response, Application } from 'express';

export const AuthController = (app: Application) => {

    const router: Router = express.Router();
    const authService = AuthService.getInstance();
    
    router.post('/login', (req: Request, res: Response) => {
        const user: User = req.body;

        authService.signin(user.email, user.password).then((results: any) => {
            res.send({
                token: results.token,
                id: results.id,
                email: results.email
            });
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(401);
        })
    });

    router.post('/register', (req: Request, res: Response) => {
        const user: User = req.body;
        console.log("Utilisateur connecté dans le controller " +user)

        authService.signup(user).then((registeredUser: User) => {
            res.send({
            ...registeredUser,
            password: ''
            });
        })
        .catch(err => {
            console.log(err);
        })
    });

    app.use('/auth', router);
};