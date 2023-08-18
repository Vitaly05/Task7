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
            session.CreatorId = Context.ConnectionId;
            sessions.Add(session);
            await Clients.Others.SendAsync("NewSession", session);
        }

        public async Task StopSession()
        {
            Session currentSession = sessions.FirstOrDefault(s => s.CreatorId == Context.ConnectionId);
            await stopSession(currentSession);
        }

        public async Task StartGame(Session session)
        {
            string group = Context.ConnectionId + session.CreatorId;
            await Groups.AddToGroupAsync(Context.ConnectionId, group);
            await Groups.AddToGroupAsync(session.CreatorId, group);
            await Clients.Group(group).SendAsync("Redirection", $"/games/{session.Game}", group);
            await stopSession(sessions.FirstOrDefault(s => s.CreatorId == session.CreatorId));
        }

        private async Task stopSession(Session session)
        {
            sessions.Remove(session);
            await Clients.Others.SendAsync("RemoveSession", session);
        }
    }
}
