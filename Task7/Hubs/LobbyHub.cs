using Microsoft.AspNetCore.SignalR;

namespace Task7.Hubs
{
    public class LobbyHub : Hub
    {
        public async Task GetAllSessions()
        {
            await Clients.Caller.SendAsync("");
        }
    }
}
