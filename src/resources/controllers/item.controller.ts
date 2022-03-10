import { Response, Request, NextFunction } from "express";

import catchAsync from "@/utils/catch-async.utils";
import AppError from "@/utils/app-error.utils";
import Item from "@/resources/models/item.model";

/*
 * @route GET api/v1/items
 * @desc get all item
 * @ascess public
 */

const getItems = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const items = await Item.find();

    return res.status(200).json({
      status: `success`,
      results: items.length,
      data: {
        items,
      },
    });
  }
);

/*
 * @route GET api/v1/items/:id
 * @desc get an item
 * @ascess public
 */

const getAnItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const item = await Item.findById(id).populate("reviews");

    if (!item) {
      return next(new AppError(`Item with 'id': ${id} not found`, 404));
    }

    return res.status(200).json({
      status: `success`,
      data: {
        item,
      },
    });
  }
);

/*
 * @route POST api/v1/items
 * @desc post new item
 * @ascess private
 */

const postAnItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

/*
 * @route PATCH api/v1/items/:id
 * @desc update an item
 * @ascess private
 */

const updateAnItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id,
      body = req.body;

    const itemUpdate = await Item.findByIdAndUpdate(id, body, {
      new: true,
      runValidator: true,
    });

    if (!itemUpdate) {
      return next(new AppError(`Item with 'id': ${id} not found`, 404));
    }

    res.status(200).json({
      status: `success`,
      data: {
        item: itemUpdate,
      },
    });
  }
);

/*
 * @route DELETE api/v1/items/:id
 * @desc delete an item
 * @ascess private
 */

const deleteAnItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    await Item.findByIdAndRemove(id);
    res.status(204).json();
  }
);

/*
 * @route DELETE api/v1/items
 * @desc delete all item
 * @ascess private
 */

const deleteAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await Item.deleteMany();
    res.status(204).json();
  }
);

export {
  getItems,
  getAnItem,
  postAnItem,
  updateAnItem,
  deleteAnItem,
  deleteAll,
};
