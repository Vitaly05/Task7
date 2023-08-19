$(document).ready(function() {
    const hubConnection = new signalR.HubConnectionBuilder().withUrl('/fourinarow').build()

    const ROWS = 6
    
    const emptyColor = 'rgb(220, 220, 220)'
    const playerColor = '#32CD32'
    const enemyColor = '#FF4500'

    let canMove = false

    hubConnection.on('EnemyName', function(enemyName) {
        localStorage.setItem('enemyName', enemyName)
    })

    hubConnection.on('Move', function(move) {
        $('#spinner').hide()
        $('#info').text('Your move')
        canMove = true
        const row = getRow(move.column)
        appendMove($(`#four-in-a-row-board > div[data-row="${row}"][data-column="${move.column}"]`), true)
    })

    hubConnection.on('Wait', function() {
        $('#spinner').show()
        $('#info').text(`Waiting for the "${localStorage.getItem('enemyName')}" move`)
        canMove = false
    })

    hubConnection.on('Winner', function(winner) {
        canMove = false
        let message, alertClass
        if (winner.name == localStorage.getItem('name')) {
            message = 'You won!'
            alertClass = 'uk-alert-success'
        } else {
            message = `"${winner.name}" won!`
            alertClass = 'uk-alert-danger'
        }
        showResult(message, alertClass)
    })

    hubConnection.on('Draw', function() {
        showResult('Draw!', 'uk-alert-warning')
    })

    $('.cell').click(function() {
        if (!canMove) return
        const column = $(this).data('column')
        const row = getRow(column)
        if (row == undefined) return
        removeHoverClass(column)
        appendMove($(`#four-in-a-row-board > div[data-row="${row}"][data-column="${column}"]`))
        hubConnection.invoke('MakeMove', localStorage.getItem('group'), getMoveData($(this)))
        canMove = false
    })

    $('.cell').on('mouseenter', function() {
        const column = $(this).data('column')
        $(`.cell[data-column="${column}"]`).each(function() {
            if (canMove && $(this).hasClass('empty')) {
                $(this).addClass('hover')
            }
        })
    })
    $('.cell').on('mouseleave', function() {
        removeHoverClass($(this).data('column'))
    })

    $('#lobby-button').hide()

    $('#lobby-button').click(function() {
        window.location.href = '/'
    })

    hubConnection.start().then(function() {
        hubConnection.invoke('InitializeGame', localStorage.getItem('group'), localStorage.getItem('name'))
    })

    function getRow(column) {
        for (let i = ROWS - 1; i >= 0; i--) {
            if ($(`#four-in-a-row-board > div[data-row="${i}"][data-column="${column}"]`).hasClass('empty')) {
                return i
            }
        }
    }

    function removeHoverClass(column) {
        $(`.cell[data-column="${column}"]`).each(function() {
            $(this).removeClass('hover')
        })
    }

    function appendMove(to, isEnemy = false) {
        const color = isEnemy ? enemyColor : playerColor
        to.removeClass('empty')
        to.animate({
            backgroundColor: color
        }, 500)
    }

    function getMoveData(clickedCell) {
        return {
            column: clickedCell.data('column'),
        }
    }

    function showResult(message, alertClass) {
        $('#info-alert').addClass(alertClass)
        $('#info').text(message)
        $('#lobby-button').show()
    }
})