using System.Numerics;
using Task7.Models.Moves;

namespace Task7.Models.Games
{
    public class FourInARowGame : BaseGameModel<FourInARowMove>
    {
        private const int Rows = 6;

        private const int Columns = 7;

        private const int ConnectToWin = 4;

        private int[,] board { get; set; } = new int[Rows, Columns];

        public override Player GetWinner()
        {
            foreach (var player in Players)
            {
                if (checkVerticals(player.Number) ||
                    checkHorizontals(player.Number) ||
                    checkLeftUpToRightDown(player.Number) ||
                    checkLeftDownToRightUp(player.Number))
                {
                    return player;
                }
            }
            return null;
        }

        public override bool IsDraw()
        {
            foreach (var element in board)
                if (element == 0) return false;
            return true;
        }

        public override void MakeMove(FourInARowMove move, int playerNumber)
        {
            for (int i = board.GetLength(0) - 1; i >= 0; i--)
                if (board[i, move.Column] == 0)
                {
                    board[i, move.Column] = playerNumber;
                    break;
                }
        }

        private bool checkVerticals(int playerNumber)
        {
            for (int col = 0; col < Columns; col++)
                for (int row = 0; row <= Rows - ConnectToWin; row++)
                {
                    bool found = true;
                    for (int i = 0; i < ConnectToWin; i++)
                    {
                        if (board[row + i, col] != playerNumber)
                        {
                            found = false;
                            break;
                        }
                    }
                    if (found) return true;
                }
            return false;
        }

        private bool checkHorizontals(int playerNumber)
        {
            for (int row = 0; row < Rows; row++)
                for (int col = 0; col <= Columns - ConnectToWin; col++)
                {
                    bool found = true;
                    for (int i = 0; i < ConnectToWin; i++)
                    {
                        if (board[row, col + i] != playerNumber)
                        {
                            found = false;
                            break;
                        }
                    }
                    if (found) return true;
                }
            return false;
        }

        private bool checkLeftUpToRightDown(int playerNumber)
        {
            for (int row = 0; row <= Rows - ConnectToWin; row++)
                for (int col = 0; col <= Columns - ConnectToWin; col++)
                {
                    bool found = true;
                    for (int i = 0; i < ConnectToWin; i++)
                    {
                        if (board[row + i, col + i] != playerNumber)
                        {
                            found = false;
                            break;
                        }
                    }
                    if (found) return true;
                }
            return false;
        }

        private bool checkLeftDownToRightUp(int playerNumber)
        {
            for (int row = ConnectToWin - 1; row < Rows; row++)
                for (int col = 0; col <= Columns - ConnectToWin; col++)
                {
                    bool found = true;
                    for (int i = 0; i < ConnectToWin; i++)
                    {
                        if (board[row - i, col + i] != playerNumber)
                        {
                            found = false;
                            break;
                        }
                    }
                    if (found) return true;
                }
            return false;
        }
    }
}
