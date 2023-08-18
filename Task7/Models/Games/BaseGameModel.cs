namespace Task7.Models.Games
{
    public abstract class BaseGameModel<TMove>
    {
        public string Group { get; set; } = "";

        public List<Player> Players { get; set; } = new List<Player>();

        public abstract void MakeMove(TMove move, int playerNumber);

        public abstract bool IsDraw();

        public abstract Player GetWinner();
    }
}
