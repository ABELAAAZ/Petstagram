
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs=require('fs');
const app = express();

const postsRoutes = require('./routes/posts-routes');
const usersRoutes = require('./routes/users-routes');
const commentsRoutes = require('./routes/comments-routes');
const fileDelete = require('./middleware/file-delete');
const HttpError = require('./models/http-errors');
const path =require('path');


// Use environment defined port or 4000
var port = process.env.PORT || 4000;

// Connect to a MongoDB --> Uncomment this once you have a connection string!!
mongoose.connect(process.env.mongo_connection,  { useNewUrlParser: true });

// Allow CORS so that backend and frontend could be put on different servers
var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, DELETE");
    next();
};


app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.json());



//app.use('/uploads/images', express.static(path.join('uploads', 'images')));


app.use('/api/posts', postsRoutes);  
app.use('/api/users', usersRoutes);  
app.use('/api/comments', commentsRoutes);  

app.use((req, res, next) => {
    const error = new HttpError('could not find the route', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if(req.file){
        fileDelete(req.file.location);
    }

    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknow error occurred!' });

});




// Start the server
app.listen(port);
console.log('Server running on port ' + port);
