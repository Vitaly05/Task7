using Task7.Data;

namespace Task7.Models
{
    public class Session
    {
        public string Id { get; set; } = "";

        public string Creator { get; set; } = "";

        public Game Game { get; set; }
    }
}
