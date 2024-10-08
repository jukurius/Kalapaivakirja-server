const express = require("express");
const app = express();
var cors = require("cors");
var cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const fs = require("fs");

if (fs.existsSync(".env.local") && process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env.local" });
  console.log("Using .env.local for development environment");
} else {
  dotenv.config();
  console.log("Using .env for production environment");
}

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

var allowedOrigins = ["http://127.0.0.1:5173", "http://localhost:5173"];
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);
app.use(cookieParser());
// Auth routes
app.use("/register", require("./routes/user/register"));
app.use("/login", require("./routes/user/auth"));
app.use("/refresh", require("./routes/user/refresh"));
app.use("/logout", require("./routes/user/logout"));
// PUBLIC routes
app.use("/latestPosts", require("./routes/API/latestPosts"));
app.use("/species", require("./routes/API/species"));
app.use("/lures", require("./routes/API/lures"));
app.use("/locations", require("./routes/API/locations"));
app.use("/citys", require("./routes/API/citys"));
// PRIVATE routes
app.use("/upload/catch", require("./routes/API/uploadCatch"));
app.use("/singlePost", require("./routes/API/singlePost"));
app.use("/filterCatchQuery", require("./routes/API/filterCatchQuery"));
app.use("/users", require("./routes/API/users"));
app.use("/comments", require("./routes/API/getComments"));
app.use("/newComment", require("./routes/API/addComment"));
app.use("/user", require("./routes/API/user"));
app.use("/catches", require("./routes/API/postsByUser"));
app.use("/analytics", require("./routes/API/analytics"));
app.use("/user/delete", require("./routes/API/deleteUser"));
app.get("/", (req, res) => res.send("Express on Vercel"));

const port = process.env.PORT;
app.listen(port, () => console.log(`Server Started on port ${port}...`));
