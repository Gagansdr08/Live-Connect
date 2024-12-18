const express = require("express");
const { chats } = require("./data/data");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoute");
const chatRoutes = require("./routes/chatRoutes");
const cors = require("cors");

const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const MessageRoutes = require("./routes/MessageRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json()); // tells the server to accept json data

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/app/chat", (req, res) => {
  res.send(chats);
});
app.use("/app/user", userRoutes);
app.use("/app/chat", chatRoutes);
app.use("/app/message", MessageRoutes);

app.get("/app/chat/:id", (req, res) => {
  const singlechat = chats.find((c) => c._id == req.params.id);
  res.send(singlechat);
});
app.use(errorHandler);
app.use(notFound);
