import { Request, Response } from "express";
import Data, { IData } from "../models/data";

export const dataUser = async (req: Request, res: Response) => {
  const { my_story, my_other_name, my_other_id } = req.body;

  try {
    const data = new Data({ my_story, my_other_name, my_other_id });
    await data.save();
    res.status(201).send(data);
  } catch (err) {
    res.status(400).send("Error creating data");
  }
};
