import express, { Request, Response, NextFunction } from 'express';

class App{
  public app: express.Application;
  public port: number;

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
}

export default App;
