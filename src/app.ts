import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import hpp from 'hpp';

class App{
  public app: express.Application;
  public port: number;
    this.middlewares();
    this.middlewares();

  constructor(){
    this.app = express();
    this.port = 3000;
  }

  public async listen(){
    this.app.get('/', (req: Request, res: Response, next: NextFunction) => {
      res.send('welcome!');
    });
    this.app.listen(this.port, () => {
      console.log(`Server is listening on port ${this.port}`);
    });
  }
  private middlewares(){
    this.app.use(helmet({}))
    this.app.use(hpp({}))
    this.app.use(cors({}))
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  } 
}

export default App;
