$(document).ready(function() {
    const hubConnection = new signalR.HubConnectionBuilder().withUrl('/tictactoe').build()

    const playerImg = '<img src="/img/cross.png" alt="X" />'
    const enemyImg = '<img src="/img/zero.png" alt="O" />'
    
    const playerColor = 'aqua'
    const enemyColor = '#FF4500'

    let canMove = false

    hubConnection.on('EnemyName', function(enemyName) {
        localStorage.setItem('enemyName', enemyName)
    })

    hubConnection.on('Move', function(move) {
        $('#spinner').hide()
        $('#info').text('Your move')
        canMove = true
        appendMove($(`#board > div[data-row="${move.row}"][data-column="${move.column}"]`), true)
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
        if (!canMove || $(this).has('.move').length > 0) return
        $(this).find('.hover').remove()
        appendMove($(this))
        hubConnection.invoke('MakeMove', localStorage.getItem('group'), getMoveData($(this)))
        canMove = false
    })

    $('.cell').on('mouseenter', function() {
        if (canMove && $(this).has('.move').length == 0) {
            $(this).append($(playerImg).addClass('hover'))
        }
    })
    $('.cell').on('mouseleave', function() {
        $(this).find('.hover').remove()
    })

    $('#lobby-button').hide()

    $('#lobby-button').click(function() {
        window.location.href = '/'
    })

    hubConnection.start().then(function() {
        hubConnection.invoke('InitializeGame', localStorage.getItem('group'), localStorage.getItem('name'))
    })

    function appendMove(to, isEnemy = false) {
        const img = isEnemy ? enemyImg : playerImg
        const color = isEnemy ? enemyColor : playerColor
        to.append($(img).addClass('move'))
        to.animate({
            backgroundColor: color
        }, 500)
    }

    function getMoveData(clickedCell) {
        return {
            row: clickedCell.data('row'),
            column: clickedCell.data('column')
        }
    }

    function showResult(message, alertClass) {
        $('#info-alert').addClass(alertClass)
        $('#info').text(message)
        $('#lobby-button').show()
    }
})