const { Router } = require("express");
const { departmentController } = require("../controllers/departmentController");
const router = Router();

router.post("/", departmentController.createDep);

router.put("/", departmentController.editDep);

router.get("/:id*?", departmentController.getDep);

module.exports = router;
