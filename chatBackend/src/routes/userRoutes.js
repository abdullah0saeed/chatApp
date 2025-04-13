const router = require("express").Router();
const {
  login,
  register,
  getAllUsers,
} = require("../controllers/userController");

router.post("/auth/login", login);
router.post("/auth/signup", register);
router.get("/users/:userId", getAllUsers);

module.exports = router;
