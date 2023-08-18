using Task7.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();

builder.Services.AddSignalR();

var app = builder.Build();

app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Games}/{action=Index}");

app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<LobbyHub>("/lobby");
    endpoints.MapHub<TicTacToeHub>("/tictactoe");
});

app.Run();
