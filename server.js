'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const cors        = require('cors');
require('dotenv').config();

//const apiRoutes         = require('./routes/api.js');
// const fccTestingRoutes  = require('./routes/fcctesting.js');
// const runner            = require('./test-runner');
let {Book} = require('./mongoose.js')

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //USED FOR FCC TESTING PURPOSES ONLY!

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index page (static HTML)
app.route('/')
    .get(function (req, res) {
        res.sendFile(process.cwd() + '/views/index.html');
    });

//For FCC testing purposes
//fccTestingRoutes(app);

//Routing for API 
//piRoutes(app);  

app.route('/api/books')
    .get(function (req, res){
    Book.find({},(err, data) => {
            if(err) return console.log(err)
            let response = []
            data.forEach(d => {
                let {_id, comments, title} = d
                response.push(
                {_id, commentcount: comments.length, title}
                )
            })
        
            res
                .json(response)
        })
    })

    .post(function (req, res){
    let title = req.body.title;

    if(!title) {
        return res.send("missing required field title")
    }

    const newBook = new Book();
    newBook.title = title;

    newBook.save(function(err, data) {
        if (err) return console.log(err)
        let {_id, title} = data
        
        res
            .json({_id, title});
    })
    })

    .delete(function(req, res){
    Book.deleteMany({}, function(err, data) {
        if(err) return console.log(err)
        res.send('complete delete successful')
        })
    });



app.route('/api/books/:id')
    .get(function (req, res) {
    let bookid = req.params.id;

    Book.find({_id: bookid},(err, data) => {
        if(err) return console.log(err)

        if(data.length === 0) {
            return res.send('no book exists')
        }
        
        let {__v, ...rest} = data[0]._doc
        res.json({...rest})
    })
    })

    .post(function(req, res) {
    let bookid = req.params.id;
    let comment = req.body.comment;
    
    if(!comment) {
        return res.send('missing required field comment')
    }
        
    Book.findById({_id: bookid}, (err, doc) => {
        if(err) return console.log('ERROR : ', err)
        if(!doc) return res.send('no book exists')

        doc.comments.push(comment)
        doc.save((err, savedDoc) => {
        if(err) return console.log('ERROR2 :', err)
                
        let {__v, _id, comments, title} = savedDoc
        res.json({_id, comments, title})
        })
    })
    })

    .delete(function(req, res) {
    let bookid = req.params.id;

    Book.findByIdAndRemove({_id: bookid}, function(err, doc) {
        if(err) return console.log(err)

        if(!doc) {
            return res.send('no book exists')
        }
        
        res.send('delete successful')
    })
    });


    
//404 Not Found Middleware
app.use(function(req, res, next) {
    res.status(404)
        .type('text')
        .send('Not Found');
});

module.exports = app; //for unit/functional testing

//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});

