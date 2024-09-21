const express = require('express');
const mongoose = require('mongoose');
const config = require('./config')
const userRouter = require('./userRoutes');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');


//create server
const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors({
    origin: '*',//allow all origins
    credentials: true,
}));

//routes
app.use('/api/users',userRouter)

app.get('/api', (req, res) => {
    res.send('hii!')
})

//connect to db
mongoose.connect(config.MONGO_URI)
    .then(() => {
        console.log('connected to db')

        //start server
        app.listen(config.PORT, () => {
            console.log(`server started on port ${config.PORT}`)
        })
    })
    .catch(err => {
        console.log(err)
    })