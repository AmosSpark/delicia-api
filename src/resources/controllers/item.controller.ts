import { Response, Request, NextFunction } from "express";

import HttpException from "@/utils/exceptions/http.exception";
import Item from "@/resources/models/item.model";

/*
 * @route GET api/v1/items
 * @desc get all item
 * @ascess public
 */

const getItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await Item.find();
    return res.status(200).json({
      status: `success`,
      results: items.length,
      data: {
        items,
      },
    });
  } catch (error: any) {
    next(new HttpException(400, error.message));
  }
};

/*
 * @route GET api/v1/items/:id
 * @desc get an item
 * @ascess public
 */

const getAnItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const item = await Item.findById(id).populate("reviews");
    return res.status(200).json({
      status: `success`,
      data: {
        item,
      },
    });
  } catch (error: any) {
    next(new HttpException(400, error.message));
  }
};

/*
 * @route POST api/v1/items
 * @desc post new item
 * @ascess private
 */

const postAnItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    try {
      const newItem = await Item.create({
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        quantity: req.body.quantity,
        unitPrice: req.body.unitPrice,
      });

      res.status(201).json({
        status: `success`,
        data: {
          item: newItem,
        },
      });
    } catch (error: any) {
      res.status(400).json({
        status: `fail`,
        message: error.message,
      });
    }
  } catch (error: any) {
    next(new HttpException(400, error.message));
  }
};

/*
 * @route PATCH api/v1/items/:id
 * @desc update an item
 * @ascess private
 */

const updateAnItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id,
      body = req.body;
    const itemUpdate = await Item.findByIdAndUpdate(id, body, {
      new: true,
      runValidator: true,
    });
    if (itemUpdate) {
      res.status(200).json({
        status: `success`,
        data: {
          item: itemUpdate,
        },
      });
    } else {
      res
        .status(404)
        .json({ message: `Item with ID: ${req.params.id} not found` });
    }
  } catch (error: any) {
    next(new HttpException(400, error.message));
  }
};

/*
 * @route DELETE api/v1/items/:id
 * @desc delete an item
 * @ascess private
 */

const deleteAnItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    await Item.findByIdAndRemove(id);
    res.status(204).json();
    next();
  } catch (error: any) {
    next(new HttpException(400, error.message));
  }
};

/*
 * @route DELETE api/v1/items
 * @desc delete all item
 * @ascess private
 */

const deleteAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Item.deleteMany();
    res.status(204).json();
  } catch (error: any) {
    next(new HttpException(400, error.message));
  }
};

export {
  getItems,
  getAnItem,
  postAnItem,
  updateAnItem,
  deleteAnItem,
  deleteAll,
};
