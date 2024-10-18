class SudokuSolver {

  validate(puzzleString) {
    const validChars = /^[1-9.]+$/;
    if (!validChars.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' };
    }
    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }
    return { valid: true };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowIndex = 'ABCDEFGHI'.indexOf(row.toUpperCase());
    const startIdx = rowIndex * 9;
    const rowValues = puzzleString.slice(startIdx, startIdx + 9).split('');
  
    const colIndex = parseInt(column) - 1;
  
    // Исключаем текущее значение только если оно не '.'
    const currentVal = rowValues[colIndex];
    rowValues[colIndex] = '.';
  
    if (rowValues.includes(value)) {
      return false;
    }
    return true;
  }
  
  checkColPlacement(puzzleString, row, column, value) {
    const colIndex = parseInt(column) - 1;
    const columnValues = [];
  
    const rowIndex = 'ABCDEFGHI'.indexOf(row.toUpperCase());
    const idxToExclude = rowIndex * 9 + colIndex;
  
    for (let i = colIndex; i < puzzleString.length; i += 9) {
      if (i !== idxToExclude) {
        columnValues.push(puzzleString[i]);
      }
    }
  
    if (columnValues.includes(value)) {
      return false;
    }
    return true;
  }
  
  checkRegionPlacement(puzzleString, row, column, value) {
    const rowIndex = 'ABCDEFGHI'.indexOf(row.toUpperCase());
    const colIndex = parseInt(column) - 1;
  
    const startRow = Math.floor(rowIndex / 3) * 3;
    const startCol = Math.floor(colIndex / 3) * 3;
  
    const regionValues = [];
  
    const idxToExclude = rowIndex * 9 + colIndex;
  
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        const idx = r * 9 + c;
        if (idx !== idxToExclude) {
          regionValues.push(puzzleString[idx]);
        }
      }
    }
  
    if (regionValues.includes(value)) {
      return false;
    }
    return true;
  }

  solve(puzzleString) {
    // Проверка валидности пазла
    const validationResult = this.validate(puzzleString);
    if (validationResult.error) {
      return false;
    }
  
    const puzzleArray = puzzleString.split('');
  
    const isValid = (puzzle, index, value) => {
      const row = Math.floor(index / 9);
      const col = index % 9;
  
      // Проверка строки
      for (let i = row * 9; i < row * 9 + 9; i++) {
        if (puzzle[i] === value && i !== index) {
          return false;
        }
      }
  
      // Проверка столбца
      for (let i = col; i < 81; i += 9) {
        if (puzzle[i] === value && i !== index) {
          return false;
        }
      }
  
      // Проверка региона
      const startRow = Math.floor(row / 3) * 3;
      const startCol = Math.floor(col / 3) * 3;
      for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
          const idx = r * 9 + c;
          if (puzzle[idx] === value && idx !== index) {
            return false;
          }
        }
      }
  
      return true;
    };
  
    // Проверка исходного пазла на конфликты
    for (let i = 0; i < puzzleArray.length; i++) {
      if (puzzleArray[i] !== '.') {
        const value = puzzleArray[i];
        if (!isValid(puzzleArray, i, value)) {
          return false; // Пазл содержит конфликты и не может быть решен
        }
      }
    }
  
    const solvePuzzle = (puzzle) => {
      for (let i = 0; i < puzzle.length; i++) {
        if (puzzle[i] === '.') {
          for (let num = 1; num <= 9; num++) {
            const value = num.toString();
            if (isValid(puzzle, i, value)) {
              puzzle[i] = value;
              if (solvePuzzle(puzzle)) {
                return true;
              }
              puzzle[i] = '.';
            }
          }
          return false; // Если ни одно число не подходит, возвращаем false
        }
      }
      return true; // Если все клетки заполнены
    };
  
    const result = solvePuzzle(puzzleArray);
    if (result) {
      return puzzleArray.join('');
    } else {
      return false;
    }
  }
}

module.exports = SudokuSolver;