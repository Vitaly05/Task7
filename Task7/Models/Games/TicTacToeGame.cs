using Task7.Models.Moves;

namespace Task7.Models.Games
{
    public class TicTacToeGame : BaseGameModel<TicTacToeMove>
    {
        private int[,] board { get; set; } = new int[3, 3];

        public override void MakeMove(TicTacToeMove move, int playerNumber) => 
            board[move.Row, move.Column] = playerNumber;

        public override bool IsDraw()
        {
            foreach (var element in board)
                if (element == 0) return false;
            return true;
        }

        public override Player GetWinner()
        {
            foreach (var player in Players)
            {
                if (checkVerticals(player.Number) ||
                    checkHorizontals(player.Number) ||
                    checkDiagonals(player.Number))
                {
                    return player;
                }
            }
            return null;
        }

        private bool checkVerticals(int playerNumber)
        {
            for (int i = 0; i < board.GetLength(0); i++)
            {
                if (checkColumn(i, playerNumber))
                    return true;
            }
            return false;
        }

        private bool checkHorizontals(int playerNumber)
        {
            for (int i = 0; i < board.GetLength(0); i++)
            {
                if (checkRow(i, playerNumber))
                    return true;
            }
            return false;
        }

        private bool checkDiagonals(int playerNumber)
        {
            bool diagonal1 = true;
            bool diagonal2 = true;
            for (int i = 0; i < board.GetLength(0); i++)
            {
                if (board[i, i] != playerNumber)
                    diagonal1 = false;

                if (board[i, board.GetLength(0) - 1 - i] != playerNumber)
                    diagonal2 = false;
            }
            return diagonal1 || diagonal2;
        }

        private bool checkColumn(int column, int playerNumber)
        {
            for (int i = 0; i < board.GetLength(0); i++)
                if (board[i, column] != playerNumber)
                    return false;
            return true;
        }

        private bool checkRow(int row, int playerNumber)
        {
            for (int i = 0; i < board.GetLength(0); i++)
                if (board[row, i] != playerNumber)
                    return false;
            return true;
        }
    }
}
