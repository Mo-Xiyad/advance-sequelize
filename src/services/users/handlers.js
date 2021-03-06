import models from "../../db/models/index.js";

const { Product, Review, User, Category, ProductCategory } = models;

const getAllUsers = async (req, res, next) => {
  try {
    const data = await User.findAll();
    res.send(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const createUser = async (req, res, next) => {
  const data = await User.create(req.body);
  res.send(data);
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const data = await User.findOne({ where: { id: req.params.id } });
    console.log(data);
    res.send(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const data = await User.update(
      { ...req.body },
      {
        where: {
          id: req.params.id,
        },
        returning: true,
      }
    );
    res.send(data[1][0]);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const data = await User.destroy({ where: { id: req.params.id } });
    res.send({ data });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const usersHandler = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};

export default usersHandler;
