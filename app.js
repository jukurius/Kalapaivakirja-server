const express = require("express");
const app = express();
var cors = require("cors");
var cookieParser = require("cookie-parser");

app.use(express.json());
var allowedOrigins = ["http://127.0.0.1:5173"];
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
// API routes
app.use("/latestPosts", require("./routes/API/latestPosts"));
app.use("/filterCatchQuery", require("./routes/API/filterCatchQuery"));
app.use("/species", require("./routes/API/species"));
app.use("/lures", require("./routes/API/lures"));
app.use("/locations", require("./routes/API/locations"));
app.use("/singlePost", require("./routes/API/singlePost"));
app.use("/citys", require("./routes/API/citys"))

const port = process.env.PORT;
app.listen(port, () => console.log(`Server Started on port ${port}...`));
