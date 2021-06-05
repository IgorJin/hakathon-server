const IDepartment = require("../models/DepartmentModel");

async function getDep(req, res) {
  const { id } = req.params;
  try {
    if (id) {
      const event = await IDepartment.findOne({ _id: id });

      if (!event) res.send(400).json({ message: "Department не найдено" });
      return res.send("get getDep " + id);
    }
  } catch (e) {
    return res.sendStatus(400);
  }
  const response = await IDepartment.find({});

  return res.status(200).send(response);
}

async function createDep(req, res) {
  console.log(req.body);
  try {
    const { internalId, region } = req.body;

    const event = await IDepartment.create({ internalId, region });
    return res.send("add dep " + event.id);
  } catch (e) {
    return res.sendStatus(400);
  }
}

async function editDep(req, res) {
  res.send("edit event");
}

exports.departmentController = {
  getDep,
  createDep,
  editDep,
};
