var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require('cors');
const helmet = require('helmet');

const volleyball = require("volleyball");
const vin = require("./routes/vin");
//Dependency for Swagger
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

//Configuration for swagger
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Altimerik API",
      description: "This is a playground",
      contact: {
        name: "Altimetrik"
      },
      servers: ["http://localhost:3000"]
    }
  },
  apis: ["./routes/vin.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

var app = express();
app.use(helmet.hidePoweredBy({ setTo: 'Altimetrik' }));
app.use(cors());
app.use(volleyball);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/vin", vin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 400);
  res.render("error");
});

module.exports = app;
