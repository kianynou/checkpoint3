import { Request, Response } from 'express';
import { User } from './../models/user';
import { UsersRepository } from '../repository/users.repository';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';

export class AuthService {
    private static instance: AuthService;
    // public connectedUser: User | undefined;
    // private secret = process.env.JWT_SECRET ? process.env.JWT_SECRET : '';

    private repository: UsersRepository;

    private constructor() {
        this.repository = UsersRepository.getInstance();
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new AuthService();
        }
        return this.instance;
    }

    async signup(user: User): Promise<User> {
        user.password = await argon2.hash(user.password);
        return this.repository.insert(user);
    }

    async signin(email: string, password: string) {
        const user = await this.repository.findByEmail(email);
        if (!user) {
            throw new Error('Les informations ne sont pas valide');
        }
        const isValid = await argon2.verify(user.password, password);
        if (!isValid) {
            throw new Error('Les informations ne sont pas valide');
        }
        const userToken = {
            email: user.email,
            id: user.id
        };

        const secret = process.env.JWT_SECRET;
        console.log(secret)
        if (!secret) {
            throw new Error('Pas de secret setup');
        }

        const token = jwt.sign(userToken, secret);

        return {
            token,
            email: user.email,
            id: user.id,
        };
    }

    // async isAdmin(req: Request, res: Response, next: Function) {
    //     if (this.connectedUser?.role === 'admin') {
    //         next();
    //     }
    //     res.sendStatus(401);
    // }

    async verifyToken(req: Request, res: Response, next: Function) {
        const authorization = req.headers.authorization;
        const bearerToken = authorization?.split(' ')[1];
        if (!bearerToken) {
            res.sendStatus(401);
        }
        else {
            try {
                const secret = process.env.JWT_SECRET ? process.env.JWT_SECRET : '';

                const results: any = await jwt.verify(bearerToken, secret);
                const user = await UsersRepository.getInstance().findByEmail(results.email);
                req.user = {
                    ...user,
                    password: undefined
                };
                next();
            } catch(e) {
                console.log(e);
                res.sendStatus(401);
            }
        }
    }

    
    
}