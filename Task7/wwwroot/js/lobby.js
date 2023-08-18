$(document).ready(function() {
    const TicTacToeGame = 0;
    const FourInARowGame = 1;

    $('#nickname-input').val(localStorage.getItem('name') || '');

    const hubConnection = new signalR.HubConnectionBuilder().withUrl('/lobby').build()

    hubConnection.on('AllSessions', function(sessions) {
        $('#join-game-modal #spinner').hide()
        displaySessions(sessions)
    })

    hubConnection.on('NewSession', function(session) {
        displaySession(session)
    })

    hubConnection.on('RemoveSession', function(session) {
        $(`#sessions-table-body #${session.creatorId}`).remove()
    })

    hubConnection.on('Redirection', function(url, group) {
        localStorage.setItem('group', group)
        window.location.href = url
    })

    $('#tic-tac-toe-button').click(function() {
        startNewSession(TicTacToeGame)
    })

    $('#four-in-a-row-button').click(function() {
        startNewSession(FourInARowGame)
    })

    UIkit.util.on('#wait-game-modal', 'hide', function() {
        hubConnection.invoke('StopSession')
    })

    $('#nickname-input').on('change', function() {
        localStorage.setItem('name', $(this).val())
    })

    hubConnection.start().then(function() {
        hubConnection.invoke('GetAllSessions')
    })
    
    function startNewSession(game) {
        hubConnection.invoke('StartNewSession', createSession(game)).then(function() {
            UIkit.modal($('#wait-game-modal')).show()
        })
    }
    
    function createSession(game) {
        return {
            creator: $('#nickname-input').val(),
            Game: game
        }
    }

    function displaySessions(sessions) {
        sessions.forEach(s => displaySession(s))
    }

    function displaySession(session) {
        let sessionTemplate = $(document.getElementById('session-template').content.cloneNode(true))
        sessionTemplate.find('tr').attr('id', session.creatorId)
        sessionTemplate.find('#creator').text(session.creator)
        sessionTemplate.find('#game').text(getGameName(session.game))
        sessionTemplate.find('#join-button').click(function() {
            hubConnection.invoke('StartGame', session)
        })
        sessionTemplate.appendTo('#sessions-table-body')
    }

    function getGameName(gameId) {
        switch (gameId) {
            case TicTacToeGame:
                return 'Tic Tac Toe'
            case FourInARowGame:
                return 'Four In A Row'
        }
    }
})