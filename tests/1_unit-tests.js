const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

const puzzlesAndSolutions = require('../controllers/puzzle-strings.js').puzzlesAndSolutions;

suite('Unit Tests', () => {

  test('Logic handles a valid puzzle string of 81 characters', () => {
    const puzzle = puzzlesAndSolutions[0][0];
    const result = solver.validate(puzzle);
    assert.deepEqual(result, { valid: true });
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    const invalidPuzzle = '1.5..2.84..63.12.7.2..5..9..1....s..8.2.3674.3..9..5.1.8.27.3..6.7...4..5..2.3.8.6';
    const result = solver.validate(invalidPuzzle);
    assert.deepEqual(result, { error: 'Invalid characters in puzzle' });
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    const shortPuzzle = puzzlesAndSolutions[0][0].slice(0, 80);
    const result = solver.validate(shortPuzzle);
    assert.deepEqual(result, { error: 'Expected puzzle to be 81 characters long' });
  });

  test('Logic handles a valid row placement', () => {
    const puzzle = puzzlesAndSolutions[0][0];
    const isValid = solver.checkRowPlacement(puzzle, 'A', '2', '3');
    assert.isTrue(isValid);
  });

  test('Logic handles an invalid row placement', () => {
    const puzzle = puzzlesAndSolutions[0][0];
    const isValid = solver.checkRowPlacement(puzzle, 'A', '2', '1');
    assert.isFalse(isValid);
  });

  test('Logic handles a valid column placement', () => {
    const puzzle = puzzlesAndSolutions[0][0];
    const isValid = solver.checkColPlacement(puzzle, 'A', '2', '3');
    assert.isTrue(isValid);
  });

  test('Logic handles an invalid column placement', () => {
    const puzzle = puzzlesAndSolutions[0][0];
    const isValid = solver.checkColPlacement(puzzle, 'A', '2', '6');
    assert.isFalse(isValid);
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    const puzzle = puzzlesAndSolutions[0][0];
    const isValid = solver.checkRegionPlacement(puzzle, 'B', '2', '3');
    assert.isTrue(isValid);
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    const puzzle = puzzlesAndSolutions[0][0];
    const isValid = solver.checkRegionPlacement(puzzle, 'B', '2', '5');
    assert.isFalse(isValid);
  });

  test('Valid puzzle strings pass the solver', () => {
    const puzzle = puzzlesAndSolutions[0][0];
    const solution = solver.solve(puzzle);
    assert.isString(solution);
    assert.equal(solution, puzzlesAndSolutions[0][1]);
  });

  test('Invalid puzzle strings fail the solver', () => {
    const invalidPuzzle = '11' + '.'.repeat(79); // Пазл с конфликтом
    const solution = solver.solve(invalidPuzzle);
    assert.isFalse(solution);
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    const puzzle = puzzlesAndSolutions[0][0];
    const expectedSolution = puzzlesAndSolutions[0][1];
    const solution = solver.solve(puzzle);
    assert.equal(solution, expectedSolution);
  });
});