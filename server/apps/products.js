import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  try {
    const collection = db.collection("products");
    const allProducts = await collection.find({}).toArray();
    return res.json({
      data: allProducts,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

productRouter.get("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productId = new ObjectId(req.params.id);

    const getProductId = await collection.findOne({ _id: productId });

    return res.json({ data: getProductId });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

productRouter.post("/", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productData = { ...req.body, created_at: new Date() };
    const newProductData = await collection.insertOne(productData);

    return res.json({
      message: `Product (${newProductData.insertedId}) has been created successfully`,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: `${error}`,
    });
  }
});

productRouter.put("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const newProductData = { ...req.body, modified_at: new Date() };
    const productId = new ObjectId(req.params.id);

    await collection.updateOne(
      {
        _id: productId,
      },
      {
        $set: newProductData,
      }
    );

    return res.json({
      message: `Product (${productId}) has been updated successfully`,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      Message: `Cannot update product`,
    });
  }
});

productRouter.delete("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productId = new ObjectId(req.params.id);

    await collection.deleteOne({
      _id: productId,
    });

    return res.json({
      message: `Product (${productId}) has been deleted successfully`,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

export default productRouter;
