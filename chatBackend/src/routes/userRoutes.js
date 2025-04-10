const router = require("express").Router();
const { login, register } = require("../controllers/userController");

router.post("/login", login);
router.post("/signup", register);

module.exports = router;
