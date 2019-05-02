/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*/

/* eslint-disable func-names */

import { aria } from './aria-utils.js';

// TODO:
// - remove key indicators (only for demoing)
// - split up in basic and example grid to drop file size
// - setFocusPointer
// - add 'render hook events':
//   - max-row-exceeded (row, col)
//   - min-row-exceeded (row, col)


/**
 * @namespace aria
 */
// const aria = aria || {};
/**
 * @desc
 *  Values for aria-sort
 */
aria.SortType = {
  ASCENDING: 'ascending',
  DESCENDING: 'descending',
  NONE: 'none'
};

/**
 * @desc
 *  DOM Selectors to find the grid components
 */
aria.GridSelector = {
  ROW: 'tr, [role="row"]',
  CELL: 'th, td, [role="gridcell"]',
  SCROLL_ROW: 'tr:not([data-fixed]), [role="row"]',
  SORT_HEADER: 'th[aria-sort]',
  TABBABLE: '[tabindex="0"]'
};

/**
 * @desc
 *  CSS Class names
 */
aria.CSSClass = {
  HIDDEN: 'hidden'
};

export class AriaGridBehavior {

  /**
   * @constructor
   *
   * @desc
   *  Grid object representing the state and interactions for a grid widget
   *
   *  Assumptions:
   *  All focusable cells initially have tabindex="-1"
   *  Produces a fully filled in mxn grid (with no holes)
   *
   * @param gridNode
   *  The DOM node pointing to the grid
   */
  constructor(gridNode) {
    this.navigationDisabled = false;
    this.gridNode = gridNode;
    this.paginationEnabled = this.gridNode.hasAttribute('data-per-page');
    this.shouldWrapCols = this.gridNode.hasAttribute('data-wrap-cols');
    this.shouldWrapRows = this.gridNode.hasAttribute('data-wrap-rows');
    this.shouldRestructure = this.gridNode.hasAttribute('data-restructure');
    this.topIndex = 0;

    ['checkFocusChange', 'checkPageChange', 'checkRestructureGrid',
    'delegateButtonHandler', 'focusClickedCell', 'restructureGrid'].forEach((method) => {
      this[method] = this[method].bind(this);
    });

    this.setupFocusGrid();
    this.setFocusPointer(0, 0);

    if (this.paginationEnabled) {
      this.setupPagination();
    }
    else {
      this.perPage = this.grid.length;
    }

    this.registerEvents();
  }

  /**
   * @desc
   *  Creates a 2D array of the focusable cells in the grid.
   */
  setupFocusGrid() {
    this.grid = [];

    Array.prototype.forEach.call(
      this.gridNode.querySelectorAll(aria.GridSelector.ROW),
      row => {
        const rowCells = [];

        Array.prototype.forEach.call(
          row.querySelectorAll(aria.GridSelector.CELL),
          cell => {
            const focusableSelector = '[tabindex]';

            if (aria.Utils.matches(cell, focusableSelector)) {
              rowCells.push(cell);
            }
            else {
              const focusableCell = cell.querySelector(focusableSelector);

              if (focusableCell) {
                rowCells.push(focusableCell);
              }
            }
          }
        );

        if (rowCells.length) {
          this.grid.push(rowCells);
        }
      }
    );

    if (this.paginationEnabled) {
      this.setupIndices();
    }
  }

  /**
   * @desc
   *  If possible, set focus pointer to the cell with the specified coordinates
   *
   * @param row
   *  The index of the cell's row
   *
   * @param col
   *  The index of the cell's column
   *
   * @returns
   *  Returns whether or not the focus could be set on the cell.
   */
  setFocusPointer(row, col) {
    if (!this.isValidCell(row, col)) {
      return false;
    }

    if (this.isHidden(row, col)) {
      return false;
    }

    if (!isNaN(this.focusedRow) && !isNaN(this.focusedCol)) {
      this.grid[this.focusedRow][this.focusedCol].setAttribute('tabindex', -1);
    }

    // Disable navigation if focused on an input
    this.navigationDisabled = aria.Utils.matches(this.grid[row][col], 'input');

    this.grid[row][col].setAttribute('tabindex', 0);
    this.focusedRow = row;
    this.focusedCol = col;

    return true;
  }

  /**
   * @param row
   *  The index of the cell's row
   *
   * @param col
   *  The index of the cell's column
   *
   * @returns
   *  Returns whether or not the coordinates are within the grid's boundaries.
   */
  isValidCell(row, col) {
    return (
      !isNaN(row) &&
      !isNaN(col) &&
      row >= 0 &&
      col >= 0 &&
      this.grid &&
      this.grid.length &&
      row < this.grid.length &&
      col < this.grid[row].length
    );
  }

  /**
   * @param row
   *  The index of the cell's row
   *
   * @param col
   *  The index of the cell's column
   *
   * @returns
   *  Returns whether or not the cell has been hidden.
   */
  isHidden(row, col) {
    const cell = this.gridNode.querySelectorAll(aria.GridSelector.ROW)[row]
      .querySelectorAll(aria.GridSelector.CELL)[col];
    return aria.Utils.hasClass(cell, aria.CSSClass.HIDDEN);
  }

  /**
   * @desc
   *  Clean up grid events
   */
  clearEvents() {
    this.gridNode.removeEventListener('keydown', this.checkFocusChange);
    this.gridNode.removeEventListener('keydown', this.delegateButtonHandler);
    this.gridNode.removeEventListener('click', this.focusClickedCell);
    this.gridNode.removeEventListener('click', this.delegateButtonHandler);

    if (this.paginationEnabled) {
      this.gridNode.removeEventListener('keydown', this.checkPageChange);
    }

    if (this.shouldRestructure) {
      window.removeEventListener('resize', this.checkRestructureGrid);
    }
  }

  /**
   * @desc
   *  Register grid events
   */
  registerEvents() {
    this.clearEvents();

    this.gridNode.addEventListener('keydown', this.checkFocusChange);
    this.gridNode.addEventListener('keydown', this.delegateButtonHandler);
    this.gridNode.addEventListener('click', this.focusClickedCell);
    this.gridNode.addEventListener('click', this.delegateButtonHandler);

    if (this.paginationEnabled) {
      this.gridNode.addEventListener('keydown', this.checkPageChange);
    }

    if (this.shouldRestructure) {
      window.addEventListener('resize', this.checkRestructureGrid);
    }
  }

  /**
   * @desc
   *  Focus on the cell in the specified row and column
   *
   * @param row
   *  The index of the cell's row
   *
   * @param col
   *  The index of the cell's column
   */
  focusCell(row, col) {
    if (this.setFocusPointer(row, col)) {
      this.grid[row][col].focus();
    }
  }

  /**
   * @desc
   *  Triggered on keydown. Checks if an arrow key was pressed, and (if possible)
   *  moves focus to the next valid cell in the direction of the arrow key.
   *
   * @param event
   *  Keydown event
   */
  checkFocusChange(event) {
    if (!event || this.navigationDisabled) {
      return;
    }

    this.findFocusedItem(event.target);

    const key = event.which || event.keyCode;
    let rowCaret = this.focusedRow;
    let colCaret = this.focusedCol;
    let nextCell;

    switch (key) {
      case aria.KeyCode.UP:
        nextCell = this.getNextVisibleCell(0, -1);
        rowCaret = nextCell.row;
        colCaret = nextCell.col;
        break;
      case aria.KeyCode.DOWN:
        nextCell = this.getNextVisibleCell(0, 1);
        rowCaret = nextCell.row;
        colCaret = nextCell.col;
        break;
      case aria.KeyCode.LEFT:
        nextCell = this.getNextVisibleCell(-1, 0);
        rowCaret = nextCell.row;
        colCaret = nextCell.col;
        break;
      case aria.KeyCode.RIGHT:
        nextCell = this.getNextVisibleCell(1, 0);
        rowCaret = nextCell.row;
        colCaret = nextCell.col;
        break;
      case aria.KeyCode.HOME:
        if (event.ctrlKey) {
          rowCaret = 0;
        }
        colCaret = 0;
        break;
      case aria.KeyCode.END:
        if (event.ctrlKey) {
          rowCaret = this.grid.length - 1;
        }
        colCaret = this.grid[this.focusedRow].length - 1;
        break;
      default:
        return;
    }

    if (this.paginationEnabled) {
      if (rowCaret < this.topIndex) {
        this.showFromRow(rowCaret, true);
      }

      if (rowCaret >= this.topIndex + this.perPage) {
        this.showFromRow(rowCaret, false);
      }
    }

    this.focusCell(rowCaret, colCaret);
    event.preventDefault();
  }

  /**
   * @desc
   *  Reset focused row and col if it doesn't match focusedRow and focusedCol
   *
   * @param focusedTarget
   *  Element that is currently focused by browser
   */
  findFocusedItem(focusedTarget) {
    const focusedCell = this.grid[this.focusedRow][this.focusedCol];

    if (focusedCell === focusedTarget ||
        focusedCell.contains(focusedTarget)) {
      return;
    }

    for (let i = 0; i < this.grid.length; i += 1) {
      for (let j = 0; j < this.grid[i].length; j += 1) {
        if (this.grid[i][j] === focusedTarget ||
            this.grid[i][j].contains(focusedTarget)) {
          this.setFocusPointer(i, j);
          return;
        }
      }
    }
  }

  /**
   * @desc
   *  Triggered on click. Finds the cell that was clicked on and focuses on it.
   *
   * @param event
   *  Keydown event
   */
  focusClickedCell({target}) {
    const clickedGridCell = this.findClosest(target, '[tabindex]');

    for (let row = 0; row < this.grid.length; row += 1) {
      for (let col = 0; col < this.grid[row].length; col += 1) {
        if (this.grid[row][col] === clickedGridCell) {
          this.setFocusPointer(row, col);

          if (!aria.Utils.matches(clickedGridCell, 'button[aria-haspopup]')) {
            // Don't focus if it's a menu button (focus should be set to menu)
            this.focusCell(row, col);
          }

          return;
        }
      }
    }
  }

  /**
   * @desc
   *  Triggered on click. Checks if user clicked on a header with aria-sort.
   *  If so, it sorts the column based on the aria-sort attribute.
   *
   * @param event
   *  Keydown event
   */
  delegateButtonHandler(event) {
    const key = event.which || event.keyCode;
    const { target } = event;
    const isClickEvent = (event.type === 'click');

    if (!target) {
      return;
    }

    if (
      target.parentNode &&
      target.parentNode.matches('th[aria-sort]') &&
      (
        isClickEvent ||
        key === aria.KeyCode.SPACE ||
        key === aria.KeyCode.RETURN
      )
    ) {
      event.preventDefault();
      this.handleSort(target.parentNode);
    }

    if (
      aria.Utils.matches(target, '.editable-text, .edit-text-button') &&
      (
        isClickEvent ||
        key === aria.KeyCode.RETURN
      )
    ) {
      event.preventDefault();
      this.toggleEditMode(
        this.findClosest(target, '.editable-text'),
        true,
        true
      );
    }

    if (
      aria.Utils.matches(target, '.edit-text-input') &&
      (
        key === aria.KeyCode.RETURN ||
        key === aria.KeyCode.ESC
      )
    ) {
      event.preventDefault();
      this.toggleEditMode(
        this.findClosest(target, '.editable-text'),
        false,
        key === aria.KeyCode.RETURN
      );
    }
  }

  /**
   * @desc
   *  Toggles the mode of an editable cell between displaying the edit button
   *  and displaying the editable input.
   *
   * @param editCell
   *  Cell to toggle
   *
   * @param toggleOn
   *  Whether to show or hide edit input
   *
   * @param updateText
   *  Whether or not to update the button text with the input text
   */
  toggleEditMode(editCell, toggleOn, updateText) {
    const onClassName = toggleOn ? 'edit-text-input' : 'edit-text-button';
    const offClassName = toggleOn ? 'edit-text-button' : 'edit-text-input';
    const onNode = editCell.querySelector(`.${onClassName}`);
    const offNode = editCell.querySelector(`.${offClassName}`);

    if (toggleOn) {
      onNode.value = offNode.innerText;
    }
    else if (updateText) {
      onNode.innerText = offNode.value;
    }

    aria.Utils.addClass(offNode, aria.CSSClass.HIDDEN);
    aria.Utils.removeClass(onNode, aria.CSSClass.HIDDEN);
    offNode.setAttribute('tabindex', -1);
    onNode.setAttribute('tabindex', 0);
    onNode.focus();
    this.grid[this.focusedRow][this.focusedCol] = onNode;
    this.navigationDisabled = toggleOn;
  }

  /**
   * @desc
   *  Sorts the column below the header node, based on the aria-sort attribute.
   *  aria-sort="none" => aria-sort="ascending"
   *  aria-sort="ascending" => aria-sort="descending"
   *  All other headers with aria-sort are reset to "none"
   *
   *  Note: This implementation assumes that there is no pagination on the grid.
   *
   * @param headerNode
   *  Header DOM node
   */
  handleSort(headerNode) {
    const columnIndex = headerNode.cellIndex;
    let sortType = headerNode.getAttribute('aria-sort');

    if (sortType === aria.SortType.ASCENDING) {
      sortType = aria.SortType.DESCENDING;
    }
    else {
      sortType = aria.SortType.ASCENDING;
    }

    const comparator = (row1, row2) => {
      const row1Text = row1.children[columnIndex].innerText;
      const row2Text = row2.children[columnIndex].innerText;
      const row1Value = parseInt(row1Text.replace(/[^0-9\.]+/g, ''), 10);
      const row2Value = parseInt(row2Text.replace(/[^0-9\.]+/g, ''), 10);

      if (sortType === aria.SortType.ASCENDING) {
        return row1Value - row2Value;
      }

        return row2Value - row1Value;

    }

    this.sortRows(comparator);
    this.setupFocusGrid();

    Array.prototype.forEach.call(
      this.gridNode.querySelectorAll(aria.GridSelector.SORT_HEADER),
      headerCell => {
        headerCell.setAttribute('aria-sort', aria.SortType.NONE);
      }
    );

    headerNode.setAttribute('aria-sort', sortType);
  }

  /**
   * @desc
   *  Sorts the grid's rows according to the specified compareFn
   *
   * @param compareFn
   *  Comparison function to sort the rows
   */
  sortRows(compareFn) {
    const rows = this.gridNode.querySelectorAll(aria.GridSelector.ROW);
    const rowWrapper = rows[0].parentNode;
    const dataRows = Array.prototype.slice.call(rows, 1);

    dataRows.sort(compareFn);

    dataRows.forEach(row => {
      rowWrapper.appendChild(row);
    });
  }

  /**
   * @desc
   *  Adds aria-rowindex and aria-colindex to the cells in the grid
   */
  setupIndices() {
    const rows = this.gridNode.querySelectorAll(aria.GridSelector.ROW);

    for (let row = 0; row < rows.length; row += 1) {
      const cols = rows[row].querySelectorAll(aria.GridSelector.CELL);
      rows[row].setAttribute('aria-rowindex', row + 1);

      for (let col = 0; col < cols.length; col += 1) {
        cols[col].setAttribute('aria-colindex', col + 1);
      }

    }
  }

  /**
   * @desc
   *  Determines the per page attribute of the grid, and shows/hides rows
   *  accordingly.
   */
  setupPagination() {
    this.onPaginationChange = this.onPaginationChange || (() => {});
    this.perPage = parseInt(this.gridNode.getAttribute('data-per-page'), 10);
    this.showFromRow(0, true);
  }

  setPaginationChangeHandler(onPaginationChange) {
    this.onPaginationChange = onPaginationChange;
  }

  /**
   * @desc
   *  Check if page up or page down was pressed, and show the next page if so.
   *
   * @param event
   *  Keydown event
   */
  checkPageChange(event) {
    if (!event) {
      return;
    }

    const key = event.which || event.keyCode;

    if (key === aria.KeyCode.PAGE_UP) {
      event.preventDefault();
      this.movePageUp();
    }
    else if (key === aria.KeyCode.PAGE_DOWN) {
      event.preventDefault();
      this.movePageDown();
    }
  }

  movePageUp() {
    const startIndex = Math.max(this.perPage - 1, this.topIndex - 1);
    this.showFromRow(startIndex, false);
    this.focusCell(startIndex, this.focusedCol);
  }

  movePageDown() {
    const startIndex = this.topIndex + this.perPage;
    this.showFromRow(startIndex, true);
    this.focusCell(startIndex, this.focusedCol);
  }

  /**
   * @desc
   *  Scroll the specified row into view in the specified direction
   *
   * @param startIndex
   *  Row index to use as the start index
   *
   * @param scrollDown
   *  Whether to scroll the new page above or below the row index
   */
  showFromRow(startIndex, scrollDown) {
    const dataRows =
      this.gridNode.querySelectorAll(aria.GridSelector.SCROLL_ROW);
    let reachedTop = false;
    let firstIndex = -1;
    let endIndex = -1;

    if (startIndex < 0 || startIndex >= dataRows.length) {
      return;
    }

    for (let i = 0; i < dataRows.length; i += 1) {

      if (
        (
          scrollDown &&
          i >= startIndex &&
          i < startIndex + this.perPage) ||
          (
            !scrollDown &&
            i <= startIndex &&
            i > startIndex - this.perPage
          )
      ) {
        aria.Utils.removeClass(dataRows[i], aria.CSSClass.HIDDEN);

        if (!reachedTop) {
          this.topIndex = i;
          reachedTop = true;
        }

        if (firstIndex < 0) {
          firstIndex = i;
        }
        endIndex = i;
      }
      else {
        aria.Utils.addClass(dataRows[i], aria.CSSClass.HIDDEN);
      }
    }
    this.onPaginationChange(firstIndex, endIndex);
  }

  /**
   * @desc
   *  Throttle restructuring to only happen every 300ms
   */
  checkRestructureGrid() {
    if (this.waitingToRestructure) {
      return;
    }

    this.waitingToRestructure = true;

    setTimeout(this.restructureGrid, 300);
  }

  /**
   * @desc
   *  Restructure grid based on the size.
   */
  restructureGrid() {
    this.waitingToRestructure = false;

    const gridWidth = this.gridNode.offsetWidth;
    const cells = this.gridNode.querySelectorAll(aria.GridSelector.CELL);
    let currentWidth = 0;

    const focusedElement = this.gridNode.querySelector(aria.GridSelector.TABBABLE);
    const shouldRefocus = (document.activeElement === focusedElement);
    const focusedIndex = (this.focusedRow * this.grid[0].length + this.focusedCol);

    let newRow = document.createElement('div');
    newRow.setAttribute('role', 'row');
    this.gridNode.innerHTML = '';
    this.gridNode.append(newRow);

    cells.forEach(function (cell, index) {
      const cellWidth = cell.offsetWidth;

      if (currentWidth > 0 && currentWidth >= (gridWidth - cellWidth)) {
        newRow = document.createElement('div');
        newRow.setAttribute('role', 'row');
        this.gridNode.append(newRow);
        currentWidth = 0;
      }

      newRow.append(cell);
      currentWidth += cellWidth;
    });

    this.setupFocusGrid();

    this.focusedRow = Math.floor(focusedIndex / this.grid[0].length);
    this.focusedCol = focusedIndex % this.grid[0].length;

    if (shouldRefocus) {
      this.focusCell(this.focusedRow, this.focusedCol);
    }
  }

  /**
   * @desc
   *  Get next cell to the right or left (direction) of the focused
   *  cell.
   *
   * @param currRow
   *  Row index to start searching from
   *
   * @param currCol
   *  Column index to start searching from
   *
   * @param directionX
   *  X direction for where to check for cells. +1 to check to the right, -1 to
   *  check to the left
   *
   * @return
   *  Indices of the next cell in the specified direction. Returns the focused
   *  cell if none are found.
   */
  getNextCell(
    currRow,
    currCol,
    directionX,
    directionY
  ) {
    let row = currRow + directionY;
    let col = currCol + directionX;
    const rowCount = this.grid.length;
    const isLeftRight = directionX !== 0;

    if (!rowCount) {
      return false;
    }

    const colCount = this.grid[0].length;

    if (this.shouldWrapCols && isLeftRight) {
      if (col < 0) {
        col = colCount - 1;
        row -= 1;
      }

      if (col >= colCount) {
        col = 0;
        row += 1;
      }
    }

    if (this.shouldWrapRows && !isLeftRight) {
      if (row < 0) {
        col -= 1;
        row = rowCount - 1;
        if (this.grid[row] && col >= 0 && !this.grid[row][col]) {
          // Sometimes the bottom row is not completely filled in. In this case,
          // jump to the next filled in cell.
          row -= 1;
        }
      }
      else if (row >= rowCount || !this.grid[row][col]) {
        row = 0;
        col += 1;
      }
    }

    if (this.isValidCell(row, col)) {
      return {
        row,
        col
      };
    }
    if (this.isValidCell(currRow, currCol)) {
      return {
        row: currRow,
        col: currCol
      };
    }

      return false;

  }

  /**
   * @desc
   *  Get next visible column to the right or left (direction) of the focused
   *  cell.
   *
   * @param direction
   *  Direction for where to check for cells. +1 to check to the right, -1 to
   *  check to the left
   *
   * @return
   *  Indices of the next visible cell in the specified direction. If no visible
   *  cells are found, returns false if the current cell is hidden and returns
   *  the current cell if it is not hidden.
   */
  getNextVisibleCell(directionX, directionY) {
    let nextCell = this.getNextCell(
      this.focusedRow,
      this.focusedCol,
      directionX,
      directionY
    );

    if (!nextCell) {
      return false;
    }

    const rowCount = this.grid.length;
    const colCount = this.grid[nextCell.row].length;

    while (this.isHidden(nextCell.row, nextCell.col)) {
      const currRow = nextCell.row;
      const currCol = nextCell.col;

      nextCell = this.getNextCell(currRow, currCol, directionX, directionY);

      if (currRow === nextCell.row && currCol === nextCell.col) {
        // There are no more cells to try if getNextCell returns the current cell
        return false;
      }
    }

    return nextCell;
  }

  /**
   * @desc
   *  Show or hide the cells in the specified column
   *
   * @param columnIndex
   *  Index of the column to toggle
   *
   * @param isShown
   *  Whether or not to show the column
   */
  toggleColumn(columnIndex, isShown) {
    const cellSelector = `[aria-colindex="${columnIndex}"]`;
    const columnCells = this.gridNode.querySelectorAll(cellSelector);

    Array.prototype.forEach.call(
      columnCells,
      cell => {
        if (isShown) {
          aria.Utils.removeClass(cell, aria.CSSClass.HIDDEN);
        }
        else {
          aria.Utils.addClass(cell, aria.CSSClass.HIDDEN);
        }
      }
    );

    if (!isShown && this.focusedCol === (columnIndex - 1)) {
      // If focus was set on the hidden column, shift focus to the right
      const nextCell = this.getNextVisibleCell(1, 0);
      if (nextCell) {
        this.setFocusPointer(nextCell.row, nextCell.col);
      }
    }
  }

  /**
   * @desc
   *  Find the closest element matching the selector. Only checks parent and
   *  direct children.
   *
   * @param element
   *  Element to start searching from
   *
   * @param selector
   *  Index of the column to toggle
   */
  findClosest(element, selector) {
    if (aria.Utils.matches(element, selector)) {
      return element;
    }

    if (aria.Utils.matches(element.parentNode, selector)) {
      return element.parentNode;
    }

    return element.querySelector(selector);
  }

}
