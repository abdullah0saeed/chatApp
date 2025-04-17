const router = require("express").Router();
const { getMsgsBtwnUsers } = require("../controllers/messageController");

router.get("/getUnseen/:user1Id/:user2Id", getMsgsBtwnUsers);

module.exports = router;
