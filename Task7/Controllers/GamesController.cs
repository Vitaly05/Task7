using Microsoft.AspNetCore.Mvc;

namespace Task7.Controllers
{
    public class GamesController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}