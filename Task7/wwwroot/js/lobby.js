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
        let f = checkSessionsExistence($('#sessions-table-body tr'))
    })

    hubConnection.on('RemoveSession', function(session) {
        $(`#sessions-table-body #${session.creatorId}`).remove()
        checkSessionsExistence($('#sessions-table-body tr'))
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
    
    $('#nickname-form').validate({ rules: { nicknameInput: 'required'} })

    $('#new-game-button').click(function() {
        showModal('#new-game-modal')
    })

    $('#join-game-button').click(function() {
        showModal('#join-game-modal')
    })
    
    hubConnection.start().then(function() {
        hubConnection.invoke('GetAllSessions')
    })

    function showModal(modal) {
        console.log($('#nickname-form').valid())
        if ($('#nickname-form').valid()) {
            UIkit.modal(modal).show()
        }
    }
    
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
        if (checkSessionsExistence(sessions)) {
            sessions.forEach(s => displaySession(s))
        }
    }

    function checkSessionsExistence(sessions) {
        if (sessions.length == 0) {
            $('#game-sessions-panel').hide()
            $('#no-one-session').show()
            return false
        } else {
            $('#game-sessions-panel').show()
            $('#no-one-session').hide()
            return true
        }
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