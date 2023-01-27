import { Request, Response, NextFunction } from 'express';

class HelloController{
  public hello = (req:Request, res:Response, next:NextFunction) => {
    try{
      res.status(200).json({message: 'Hello'});
    }catch(error){
      next(error);
    }
  }
}
export default HelloController