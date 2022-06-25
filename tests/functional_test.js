/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai
          .request(server)
          .post('/api/books')
          .send({title: 'the lord of tests'})
          .end(function (err, res) {
            assert.property(res.body, '_id', 'Books added should contain _id');
            assert.property(res.body, 'title', 'Books added should contain title')
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai
          .request(server)
          .post('/api/books')
          .send({title: ''})
          .end(function (err, res) {
            assert.equal(res.text, 'missing required field title');
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai
          .request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
          .request(server)
          .get('/api/books/6256f384613e539d9163d123')
          .end(function(err, res) {
            assert.equal(res.text, 'no book exists')
            done();
          })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai
          .request(server) 
          .get('/api/books/62b72278eb1fdc874716f385')
          .end(function(err, res) {
            assert.property(res.body, 'comments', 'res.body should contain comments');
            assert.isArray(res.body.comments, 'res.body.comments should be an array');
            assert.property(res.body, 'title', 'res.body should contain title');
            assert.property(res.body, '_id', 'res.body should contain _id');
            done();
          })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai
          .request(server)
          .post('/api/books/62b72278eb1fdc874716f385')
          .send({comment: 'test6'})
          .end(function(err, res) {
            assert.property(res.body, 'comments', 'res.body should contain comments');
            assert.isArray(res.body.comments, 'comments', 'res.body should be a array');
            assert.property(res.body, 'title', 'res.body should contain title');
            assert.property(res.body, '_id', 'res.body should contain _id');
            done();
          })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai
          .request(server)
          .post('/api/books/6256f384613e539d9163d376')
          .send({comment: ''})
          .end(function(err, res) {
            assert.equal(res.text, 'missing required field comment');
            done();
          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai
          .request(server)
          .post('/api/books/6256f384613e539d9163d789')
          .send({comment: 'test9'})
          .end(function(err, res) {
            assert.equal(res.text, 'no book exists');
            done();
          })
      });
      
    });

    // suite('DELETE /api/books/[id] => delete book object id', function() {

    //   test('Test DELETE /api/books/[id] with valid id in db', function(done){
    //     chai
    //       .request(server) //cambiar este id en cada test
    //       .delete('/api/books/6258362d22dbe0ac5f59399e')
    //       .end(function(err, res) {
    //         assert.equal(res.text, 'delete successful');
    //         done();
    //       })
    //   });

    //   test('Test DELETE /api/books/[id] with  id not in db', function(done){
    //     chai
    //       .request(server)
    //       .delete('/api/books/6256f384613e539d9163d123')
    //       .end(function(err, res) {
    //         assert.equal(res.text, 'no book exists');
    //         done();
    //       })
    //   });

    // });

  });

});
