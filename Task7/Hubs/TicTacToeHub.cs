using Microsoft.AspNetCore.SignalR;
using Task7.Models;

namespace Task7.Hubs
{
    public class TicTacToeHub : Hub
    {
        private static List<TicTacToeGame> games = new List<TicTacToeGame>();

        public async Task InitializeGame(string group, string name)
        {
            createGame(group);
            var game = games.FirstOrDefault(g => g.Group == group);
            await addPlayer(game, name);
            if (game.Players.Count() == 2)
                await startGame(game);
        }

        public async Task MakeMove(string group, TicTacToeMove move)
        {
            await Clients.OthersInGroup(group).SendAsync("Move", move);
            var game = games.FirstOrDefault(g => g.Group == group);
            game.Board[move.Row, move.Column] = getPalyerNumber(game);
            await processGameResult(game);
        }

        private void createGame(string group)
        {
            if (!games.Any(g => g.Group == group))
                games.Add(new TicTacToeGame() { Group = group });
        }

        private async Task addPlayer(TicTacToeGame game, string name)
        {
            if (game.Players.Count() >= 2)
                return;
            game.Players.Add(new Player()
            {
                Id = Context.ConnectionId,
                Name = name,
                Number = game.Players.Count() + 1
            });
            await Groups.AddToGroupAsync(Context.ConnectionId, game.Group);
        }

        private async Task startGame(TicTacToeGame game)
        {
            getRandomPlayersOrder(game.Players, out Player firstPlayer, out Player secondPlayer);
            await Clients.Client(firstPlayer.Id).SendAsync("EnemyName", secondPlayer.Name);
            await Clients.Client(secondPlayer.Id).SendAsync("EnemyName", firstPlayer.Name);
            await Clients.Client(secondPlayer.Id).SendAsync("Wait");
            await Clients.Client(firstPlayer.Id).SendAsync("Move");
        }

        private void getRandomPlayersOrder(List<Player> players, out Player firstPlayer, out Player secondPlayer)
        {
            var index = new Random().Next(0, 2);
            firstPlayer = players[index];
            secondPlayer = players[1 - index];
        }

        private int getPalyerNumber(TicTacToeGame game) => 
            game.Players.FirstOrDefault(p => p.Id == Context.ConnectionId).Number;

        private async Task processGameResult(TicTacToeGame game)
        {
            var winner = game.GetWinner();
            if (winner is not null)
                await Clients.Group(game.Group).SendAsync("Winner", winner);
            else if (game.IsDraw())
                await Clients.Group(game.Group).SendAsync("Draw");
            else
                await Clients.Caller.SendAsync("Wait");
        }
    }
}
