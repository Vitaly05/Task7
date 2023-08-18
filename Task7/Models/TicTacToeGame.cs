﻿using System.Numerics;

namespace Task7.Models
{
    public class TicTacToeGame
    {
        public string Group { get; set; } = "";

        public List<Player> Players { get; set; } = new List<Player>();

        public int[,] Board { get; set; } = new int[3, 3];

        public bool IsDraw()
        {
            foreach (var element in Board)
                if (element == 0) return false;
            return true;
        }

        public Player GetWinner()
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
            for (int i = 0; i < Board.GetLength(0); i++)
            {
                if (checkColumn(i, playerNumber))
                    return true;
            }
            return false;
        }

        private bool checkHorizontals(int playerNumber)
        {
            for (int i = 0; i < Board.GetLength(0); i++)
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
            for (int i = 0; i < Board.GetLength(0); i++)
            {
                if (Board[i, i] != playerNumber)
                    diagonal1 = false;

                if (Board[i, Board.GetLength(0) - 1 - i] != playerNumber)
                    diagonal2 = false;
            }
            return diagonal1 || diagonal2;
        }

        private bool checkColumn(int column, int playerNumber)
        {
            for (int i = 0; i < Board.GetLength(0); i++)
                if (Board[i, column] != playerNumber)
                    return false;
            return true;
        }

        private bool checkRow(int row, int playerNumber)
        {
            for (int i = 0; i < Board.GetLength(0); i++)
                if (Board[row, i] != playerNumber)
                    return false;
            return true;
        }
    }
}
