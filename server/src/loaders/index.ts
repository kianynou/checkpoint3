import expressLoader from './express';
import { Application } from 'express';
import dotenv from 'dotenv';


export default async (app: Application ) => {
  dotenv.config();

  await expressLoader(app);
  console.log('Express Intialized');

  // Rajouter le loader MySQL
};
