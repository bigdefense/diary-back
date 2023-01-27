import { Router } from "express";
import HelloController from "../controller/hello.controller";

class Hello{
  public path = '/'
  public router = Router();
  public helloController = new HelloController();
  constructor(){
    this.router.get(this.path, this.helloController.hello);
  }
}

export default Hello;