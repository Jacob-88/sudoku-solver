const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const puzzlesAndSolutions = require('../controllers/puzzle-strings').puzzlesAndSolutions;

chai.use(chaiHttp);

suite('Functional Tests', () => {

  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function(done) {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: puzzlesAndSolutions[0][0] })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.solution, puzzlesAndSolutions[0][1]);
        done();
      });
  });

  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function(done) {
    chai.request(server)
      .post('/api/solve')
      .send({})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field missing');
        done();
      });
  });

  test('Solve a puzzle with invalid characters: POST request to /api/solve', function(done) {
    const invalidPuzzle = puzzlesAndSolutions[0][0].replace('.', 'X');
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: invalidPuzzle })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });

  test('Solve a puzzle with incorrect length: POST request to /api/solve', function(done) {
    const shortPuzzle = puzzlesAndSolutions[0][0].slice(0, 80);
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: shortPuzzle })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });

  test('Solve a puzzle that cannot be solved: POST request to /api/solve', function(done) {
    const invalidPuzzle = '11' + '.'.repeat(79); // Пазл с конфликтом
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: invalidPuzzle })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Puzzle cannot be solved');
        done();
      });
  });

  test('Check a puzzle placement with all fields: POST request to /api/check', function(done) {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: '3' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isTrue(res.body.valid);
        done();
      });
  });

  test('Check a puzzle placement with single placement conflict: POST request to /api/check', function(done) {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: '6' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.sameMembers(res.body.conflict, ['column', 'region']);
        done();
      });
  });
  

  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function(done) {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: '1' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.isAtLeast(res.body.conflict.length, 2);
        done();
      });
  });

  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function(done) {
    // Позиция 'A2', значение '2' должно конфликтовать во всех областях
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: '2' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.sameMembers(res.body.conflict, ['row', 'column', 'region']);
        done();
      });
  });

  test('Check a puzzle placement with missing required fields: POST request to /api/check', function(done) {
    chai.request(server)
      .post('/api/check')
      .send({ coordinate: 'A2', value: '3' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field(s) missing');
        done();
      });
  });

  test('Check a puzzle placement with invalid characters: POST request to /api/check', function(done) {
    const invalidPuzzle = puzzlesAndSolutions[0][0].replace('.', 'X');
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: invalidPuzzle, coordinate: 'A2', value: '3' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });

  test('Check a puzzle placement with incorrect length: POST request to /api/check', function(done) {
    const shortPuzzle = puzzlesAndSolutions[0][0].slice(0, 80);
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: shortPuzzle, coordinate: 'A2', value: '3' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });

  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function(done) {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'Z9', value: '3' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid coordinate');
        done();
      });
  });

  test('Check a puzzle placement with invalid placement value: POST request to /api/check', function(done) {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: '10' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid value');
        done();
      });
  });
});