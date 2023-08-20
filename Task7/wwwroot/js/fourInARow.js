$(document).ready(function() {
    url = '/fourinarow'
    game = new FourInARowGame()
})

class FourInARowGame {
    constructor() {
        this.canMove = false
        this.ROWS = 6
        this.playerColor = '#32CD32'
        this.enemyColor = '#FF4500'
    }

    onEnemyMove(move) {
        const row = this.getRow(move.column)
        this.appendMove($(`#four-in-a-row-board > div[data-row="${row}"][data-column="${move.column}"]`), true)
    }

    onCellClick(element) {
        const column = element.data('column')
        const row = this.getRow(column)
        if (row == undefined) return false
        this.removeHoverClass(column)
        this.appendMove($(`#four-in-a-row-board > div[data-row="${row}"][data-column="${column}"]`))
        return true
    }

    onCellMouseEnter(element) {
        const column = element.data('column')
        const self = this
        $(`.cell[data-column="${column}"]`).each(function() {
            if (self.canMove && $(this).hasClass('empty')) {
                $(this).addClass('hover')
            }
        })
    }

    onCellMouseLeave(element) {
        this.removeHoverClass(element.data('column'))
    }

    getRow(column) {
        for (let i = this.ROWS - 1; i >= 0; i--) {
            if ($(`#four-in-a-row-board > div[data-row="${i}"][data-column="${column}"]`).hasClass('empty')) {
                return i
            }
        }
    }

    removeHoverClass(column) {
        $(`.cell[data-column="${column}"]`).each(function() {
            $(this).removeClass('hover')
        })
    }

    appendMove(to, isEnemy = false) {
        const color = isEnemy ? this.enemyColor : this.playerColor
        to.removeClass('empty')
        to.animate({
            backgroundColor: color
        }, 500)
    }

    getMoveData(clickedCell) {
        return {
            column: clickedCell.data('column'),
        }
    }
}