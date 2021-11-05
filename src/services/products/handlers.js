import models from "../../db/models/index.js";

const { Product, Review, User, Category, ProductCategory } = models;

const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      include: [Review, { model: Category, through: { attributes: [] } }],
      order: [["createdAt", "DESC"]],
    });

    res.send(products);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const createproduct = async (req, res, next) => {
  try {
    const { categories, ...rest } = req.body;

    const data = await Product.create(rest);

    const valuesTo = categories.map((category) => ({
      categoryId: category,
      productId: data.id,
    }));

    await ProductCategory.bulkCreate(valuesTo);

    res.send(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    // const data = await Product.findByPk(req.params.id);
    const data = await Product.findOne({
      where: { id: req.params.id },
      include: [Review, { model: Category, through: { attributes: [] } }],
    });
    res.send(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    // delete req.body.id; //this is deleting the field that should not be updated by the user
    const updatedProduct = await Product.update(
      { ...req.body },
      {
        where: {
          id: req.params.id,
        },
        returning: true,
      }
    );

    res.send(updatedProduct[1][0]);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const data = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.send({ data });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// ---------PRODUCT CATEGORIES ENDPOINTS---------

//{{localUrl}}/products/removeCategory
const deleteProductCategory = async (req, res, next) => {
  try {
    const { categories, productId } = req.body;

    await ProductCategory.destroy({
      where: { productId: productId, categoryId: categories },
    });

    res.send({ ProductCategory });
  } catch (error) {
    console.log(error);
  }
};

const addCetegoryToProducts = async (req, res, next) => {
  const { categories, productId } = req.body;

  const valuesTo = categories.map((category) => ({
    categoryId: category,
    productId: productId,
  }));

  await ProductCategory.bulkCreate(valuesTo);

  const data = await Product.findOne({
    where: { id: req.body.productId },
    include: [Review, { model: Category, through: { attributes: [] } }],
  });

  res.send(data);
};

const productHandler = {
  getAllProducts,
  createproduct,
  getProductById,
  updateProduct,
  deleteProduct,
  deleteProductCategory,
  addCetegoryToProducts,
};

export default productHandler;
