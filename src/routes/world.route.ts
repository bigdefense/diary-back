import { Router } from "express";
import WorldController from "../controller/world.controller";

class world{
  public path = '/world'
  public router = Router();
  public worldController = new WorldController();
  constructor(){
    this.router.get(this.path, this.worldController.world);
  }
}

export default world;