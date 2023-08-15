using Microsoft.AspNetCore.Mvc;

namespace Task7.Controllers
{
    public class GameController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}