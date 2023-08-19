$(document).ready(function() {
    const hubConnection = new signalR.HubConnectionBuilder().withUrl(url).build()

    hubConnection.on('EnemyName', function(enemyName) {
        localStorage.setItem('enemyName', enemyName)
    })

    hubConnection.on('Move', function(move) {
        $('#spinner').hide()
        $('#info').text('Your move')
        game.canMove = true
        game.onEnemyMove(move)
    })

    hubConnection.on('Wait', function() {
        $('#spinner').show()
        $('#info').text(`Waiting for the "${localStorage.getItem('enemyName')}" move`)
        game.canMove = false
    })

    hubConnection.on('Winner', function(winner) {
        game.canMove = false
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
        if (!game.canMove) return
        if (game.onCellClick($(this))) {
            hubConnection.invoke('MakeMove', localStorage.getItem('group'), game.getMoveData($(this)))
            game.canMove = false
        }
    })

    $('.cell').on('mouseenter', function() {
        game.onCellMouseEnter($(this))
    })
    $('.cell').on('mouseleave', function() {
        game.onCellMouseLeave($(this))
    })

    $('#lobby-button').hide()

    $('#lobby-button').click(function() {
        window.location.href = '/'
    })

    hubConnection.start().then(function() {
        hubConnection.invoke('InitializeGame', localStorage.getItem('group'), localStorage.getItem('name'))
    })

    function showResult(message, alertClass) {
        $('#info-alert').addClass(alertClass)
        $('#info').text(message)
        $('#lobby-button').show()
    }
})