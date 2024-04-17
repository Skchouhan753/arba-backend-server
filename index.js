require("dotenv").config()
const express = require("express");
const cors = require("cors");

const cookieParser = require("cookie-parser");
// const cloudinary = require("cloudinary").v2; // For cloudinary v2
// const Stripe = require("stripe");

// const helmet = require("helmet");
// const mongoSanitize = require("express-mongo-sanitize");



const { connection } = require("./config/db");
const { userRuter } = require("./routes/userRoutes");


//stripe configuration
// export const stripe = new Stripe(process.env.STRIPE_API_SECRET);

//cloudinary Config
// cloudinary.v2.config({
  // cloud_name: process.env.CLOUDINARY_NAME,
  // api_key: process.env.CLOUDINARY_API_KEY,
  // api_secret: process.env.CLOUDINARY_SECRET,
// });

//rest object
const app = express();

//middlewares
// app.use(helmet());
// app.use(mongoSanitize());

app.use(express.json());
app.use(cors());
app.use(cookieParser());

//route
//routes imports

// import userRoutes from "./routes/userRoutes.js";
// import productRoutes from "./routes/productRoutes.js";
// import categoryRoutes from "./routes/categoryRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";

app.use("/user", userRuter);
// app.use("/api/v1/product", productRoutes);
// app.use("/api/v1/cat", categoryRoutes);
// app.use("/api/v1/order", orderRoutes);

app.get("/", (req, res) => {
  return res.status(200).send("<h1>Welcome To Node server </h1>");
});

//port
const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  try {
    await connection;
    console.log(`server is running at port ${PORT}`);
    console.log(`connected to mongoDB`);
  } catch (err) {
    console.log(err);
  }
});