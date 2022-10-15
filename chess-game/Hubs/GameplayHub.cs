using Microsoft.AspNetCore.SignalR;

namespace chess_game.Hubs;

public class GameplayHub : Hub
{
    public async Task MakeMoveOnTheBoard(string pieceId, string fieldId)
    {
        await Clients.All.SendAsync("movePiece", pieceId, fieldId);
    }
    
}