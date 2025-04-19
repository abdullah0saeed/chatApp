const { User, userValidationSchema } = require("../models/userModel");
const Message = require("../models/messageModel");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  const { username = "", password } = req.body;
  let fetchedUser;
  // Check if user exists using username
  User.findOne({ username }).then((user) => {
    if (user) {
      let isValidPassword = bcrypt.compareSync(password, user.password);
      if (isValidPassword) {
        fetchedUser = user;
      } else
        return res.status(401).json({
          message: "Invalid password",
        });
    }
    User.findOne({ email: username }).then((user) => {
      if (user) {
        let isValidPassword = bcrypt.compareSync(password, user.password);
        if (isValidPassword) {
          fetchedUser = user;
        } else
          return res.status(401).json({
            message: "Invalid password",
          });
      }
    });

    if (!fetchedUser) {
      return res.status(401).json({
        message: "user not found",
      });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: fetchedUser._id,
        username: fetchedUser.username,
        email: fetchedUser.email,
        fname: fetchedUser.fname,
        lname: fetchedUser.lname,
      },
    });
  });

  try {
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "An error occurred during login",
    });
  }
};
////////////////////////////////////////////////////////////////////////////?
exports.register = async (req, res) => {
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }
  const { username, email, fname, lname, password } = req.body;

  let existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    return res.status(400).json({
      message: "Email already registered",
    });
  }

  existingUser = await User.findOne({
    username,
  });

  if (existingUser) {
    return res.status(400).json({
      message: "Choose a different username",
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({
    username,
    email,
    fname,
    lname,
    password: hashedPassword,
  });
  try {
    const savedUser = await newUser.save();
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        fname: savedUser.fname,
        lname: savedUser.lname,
      },
    });
  } catch (error) {
    console.error("Error saving user:", error.message);
    return res.status(500).json({
      message: "An error occurred during registration",
    });
  }
};
////////////////////////////////////////////////////////////////////////////?

exports.getAllUsers = async (req, res) => {
  const { userId } = req.params;

  // Validate userId
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Fetch all users except the current user
    const users = await User.find({ _id: { $ne: userId } });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Fetch new messages for the current user
    const myNewMsgs = await Message.find(
      { receiverId: userId, seen: false },
      { senderId: 1 }
    );

    // Preprocess messages into a map for efficient lookups
    const msgCountMap = {};
    myNewMsgs.forEach((msg) => {
      if (!msgCountMap[msg.senderId]) {
        msgCountMap[msg.senderId] = 0;
      }
      msgCountMap[msg.senderId]++;
    });

    // Add newMsgs count to each user
    const usersWithNewMsgs = users.map((user) => ({
      ...user._doc,
      newMsgs: msgCountMap[user._id] ? String(msgCountMap[user._id]) : "0", // Default to 0 if no new messages
    }));

    return res.status(200).json({
      message: "Users fetched successfully",
      users: usersWithNewMsgs,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return res.status(500).json({
      message: "An error occurred while fetching users",
      error: error.message, // Include error details for debugging
    });
  }
};
