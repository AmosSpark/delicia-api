import { Response, Request, NextFunction } from "express";

import catchAsync from "@/utils/catch-async.utils";
import AppError from "@/utils/app-error.utils";
import QueryFeatures from "@/utils/query.features";
import Item from "@/resources/models/item.model";

/*
 * @route GET api/v1/items
 * @desc get all item
 * @ascess public
 */

const getItems = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Execute query
    const queryFeatures = new QueryFeatures(Item.find(), req.query)
      .filter()
      .sort()
      .limitFileds()
      .paginate();

    const items = await queryFeatures.query;

    return res.status(200).json({
      status: `success`,
      results: items.length,
      totalDoc: await Item.countDocuments(),
      data: {
        items,
      },
    });
  }
);

/*
 * @route GET api/v1/top-5-items
 * @desc get all item
 * @ascess public
 */

const getTop5Items = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    req.query.limit = "5";
    // sort by averagere rating (descending) & price
    req.query.sort = "-averageRating, unitPrice";
    req.query.fields = "name, image, description, averageRating, unitPrice";
    next();
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
      category: req.body.category,
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

/*
 * @route GET api/v1/items/stats
 * @desc get item statistics
 * @ascess private
 */

const getItemStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const stats = await Item.calcItemStats();

    res.status(200).json({
      status: `success`,
      results: stats.length,
      data: {
        stats,
      },
    });
  }
);

export {
  getItems,
  getTop5Items,
  getAnItem,
  postAnItem,
  updateAnItem,
  deleteAnItem,
  deleteAll,
  getItemStats,
};
