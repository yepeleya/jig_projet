const prisma = require("../utils/prismaClient");

exports.getAllImages = async (req, res, next) => {
  try {
    const images = await prisma.galerie.findMany();
    res.json(images);
  } catch (error) {
    next(error);
  }
};

exports.uploadImage = async (req, res, next) => {
  try {
    const { imageUrl, titre } = req.body;
    const newImage = await prisma.galerie.create({
      data: { imageUrl, titre },
    });
    res.status(201).json(newImage);
  } catch (error) {
    next(error);
  }
};
