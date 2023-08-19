$(document).ready(function() {
    url = '/tictactoe'
    game = new TicTacToeGame()
})

class TicTacToeGame {
    constructor() {
        this.canMove = false
        this.playerImg = '<img src="/img/cross.png" alt="X" />'
        this.enemyImg = '<img src="/img/zero.png" alt="O" />'
        this.playerColor = 'aqua'
        this.enemyColor = '#FF4500'
    }

    onEnemyMove(move) {
        this.appendMove($(`#board > div[data-row="${move.row}"][data-column="${move.column}"]`), true)
    }

    onCellClick(element) {
        if (element.has('.move').length > 0) return false
        element.find('.hover').remove()
        this.appendMove(element)
        return true
    }

    onCellMouseEnter(element) {
        if (this.canMove && element.has('.move').length == 0) {
            element.append($(this.playerImg).addClass('hover'))
        }
    }

    onCellMouseLeave(element) {
        element.find('.hover').remove()
    }

    appendMove(to, isEnemy = false) {
        const img = isEnemy ? this.enemyImg : this.playerImg
        const color = isEnemy ? this.enemyColor : this.playerColor
        to.append($(img).addClass('move'))
        to.animate({
            backgroundColor: color
        }, 500)
    }

    getMoveData(clickedCell) {
        return {
            row: clickedCell.data('row'),
            column: clickedCell.data('column')
        }
    }
}