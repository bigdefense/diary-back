import express, {Request, Response, NextFunction} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import hpp from 'hpp';
import {Route} from './interface/route.interface';

class App {
  public app: express.Application;
  public port: number;

  constructor(routes: Route[]) {
    this.app = express();
    this.port = 3000;
    this.middlewares();
    this.routes(routes);
    this.errorHandlers();
  }

  public async listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is listening on port ${this.port}`);
    });
  }

  private middlewares() {
    this.app.use(helmet({}));
    this.app.use(hpp({}));
    this.app.use(cors({}));
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended: true}));
    this.app.use(cookieParser());
  }

  public routes(routes: Route[]) {
    routes.map(route => this.app.use('/', route.router));
  }

  private errorHandlers() {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      try {
        console.error(
          `${req.method} ${req.path} ${res.statusCode} ${res.statusMessage}`,
        );
        res.status(500).json({message: 'Something went wrong'});
      } catch (error) {
        next(error);
      }
    });
  }
}

export default App;
