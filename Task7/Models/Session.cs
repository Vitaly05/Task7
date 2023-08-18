using Task7.Data;

namespace Task7.Models
{
    public class Session
    {
        public string CreatorId { get; set; } = "";

        public string Creator { get; set; } = "";

        public Game Game { get; set; }
    }
}
