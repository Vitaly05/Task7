using Microsoft.AspNetCore.SignalR;
using Task7.Models;

namespace Task7.Hubs
{
    public class LobbyHub : Hub
    {
        private static List<Session> sessions = new List<Session>();

        public async Task GetAllSessions()
        {
            await Clients.Caller.SendAsync("AllSessions", sessions);
        }

        public async Task StartNewSession(Session session)
        {
            session.Id = Context.ConnectionId;
            sessions.Add(session);
            await Clients.Others.SendAsync("NewSession", session);
        }

        public async Task StopSession()
        {
            Session currentSession = sessions.FirstOrDefault(s => s.Id == Context.ConnectionId);
            sessions.Remove(currentSession);
            await Clients.Others.SendAsync("RemoveSession", currentSession);
        }
    }
}
