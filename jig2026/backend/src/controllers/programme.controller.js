const prisma = require("../utils/prismaClient");

exports.getAllProgrammes = async (req, res, next) => {
  try {
    const programmes = await prisma.programme.findMany();
    res.json(programmes);
  } catch (error) {
    next(error);
  }
};

exports.createProgramme = async (req, res, next) => {
  try {
    const { titre, description, date } = req.body;
    const newProgramme = await prisma.programme.create({
      data: { titre, description, date: new Date(date) },
    });
    res.status(201).json(newProgramme);
  } catch (error) {
    next(error);
  }
};
