'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      // Проверка на наличие обязательных полей
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      // Валидация строки пазла
      const validationResult = solver.validate(puzzle);
      if (validationResult.error) {
        return res.json(validationResult);
      }

      // Валидация координаты
      const coordinateUpper = coordinate.toUpperCase();
      if (!/^[A-I][1-9]$/.test(coordinateUpper)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      const row = coordinateUpper[0];
      const column = coordinateUpper[1];

      // Валидация значения
      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      const conflict = [];

      // Получение индекса в строке пазла
      const rowIndex = 'ABCDEFGHI'.indexOf(row);
      const colIndex = parseInt(column) - 1;
      const idx = rowIndex * 9 + colIndex;

      // Проверка, что индексы находятся в допустимом диапазоне
      if (rowIndex < 0 || rowIndex > 8 || colIndex < 0 || colIndex > 8) {
        return res.json({ error: 'Invalid coordinate' });
      }

      // Проверка, совпадает ли значение с текущим в пазле
      const currentValue = puzzle[idx];

      if (currentValue !== '.' && currentValue === value) {
        // Значение уже установлено и не конфликтует
        return res.json({ valid: true });
      }

      // Проверка размещения
      const validRow = solver.checkRowPlacement(puzzle, row, column, value);
      const validCol = solver.checkColPlacement(puzzle, row, column, value);
      const validRegion = solver.checkRegionPlacement(puzzle, row, column, value);

      if (!validRow) conflict.push('row');
      if (!validCol) conflict.push('column');
      if (!validRegion) conflict.push('region');

      if (conflict.length > 0) {
        return res.json({ valid: false, conflict });
      }

      res.json({ valid: true });
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      const validationResult = solver.validate(puzzle);
      if (validationResult.error) {
        return res.json(validationResult);
      }

      const solution = solver.solve(puzzle);
      if (!solution) {
        return res.json({ error: 'Puzzle cannot be solved' });
      }

      res.json({ solution });
    });
};