$(document).ready(function() {
    const hubConnection = new signalR.HubConnectionBuilder().withUrl('/lobby').build()

    hubConnection.on('', function() {

    })

    hubConnection.start().then(function() {
        
    })
})