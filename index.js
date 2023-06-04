const express =  require('express');
const dbConnect = require('./config/dbConnect');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 5000;

const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const morgan = require('morgan');


dbConnect()
app.listen(PORT,() => {
    console.log(`Server running on PORT ${PORT}`)
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser());
app.use(morgan('dev'));

app.use("/api/user",authRouter);
app.use("/api/product",productRouter);

app.use(notFound);
app.use(errorHandler);

