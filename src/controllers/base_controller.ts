import { Request, Response } from "express";
import mongoose from "mongoose";



class BaseController<ModelType> {
    ItemModel: mongoose.Model<ModelType>;
    constructor(ItemModel: mongoose.Model<ModelType>){
        this.ItemModel = ItemModel;
    }   
    async get  (req: Request, res: Response){
        console.log("get all");
    
        try {
            if(req.params.id){
                console.log("get by id in if");
                const item  = await this.ItemModel.findById(req.params.id);
                res.status(200).send(item);
            }   else{
                const item = await this.ItemModel.find();
                res.status(200).send(item);
            }
        } catch (error){
            console.log(error);
            res.status(400).send(error.message);
        }
    }
    
    async getById (req: Request, res: Response)  {
        console.log("get by id");
        try{
            const item = await this.ItemModel.findById(req.body.user);
            if(!item){
                res.status(404).send("not found");
            }
            else{
                res.status(200).send(item);  
            }   
        }catch (error){
            console.log(error);
            res.status(400).send(error.message);
        }
    }
    
    async post  (req: Request, res: Response) {
        console.log("post");
        try{
            const item = await this.ItemModel.create(req.body);
            res.status(201).send(item);
        } catch (error){
            console.log(error);
            res.status(400).send(error.message);
        }
    }
    
    async put  (req: Request, res: Response) {
        console.log("put");
        console.log(req.params);
        try{
            const item = await this.ItemModel.findById(req.params.id);
            if(!item){
                res.status(404).send("not found");
            }
            else{
                item.set(req.body);
                await item.save();
                res.status(200).send(item);
            }
        } catch (error){
            console.log(error);
            res.status(400).send(error.message);
        }
    }
    
    async remove (req: Request, res: Response) {
        console.log("delete");
        console.log(req.params);
        try {
          await this.ItemModel.findByIdAndDelete(req.params.id);
          return res.status(200).send();
        } catch (error) {
          console.log(error);
          res.status(400).send(error.message);
        }
      }

      
}



export default BaseController;