using Microsoft.AspNetCore.SignalR;

namespace chess_game.Hubs;

public class GameplayHub : Hub
{
    private static List<string> _connectionsId = new List<string>();
    public async Task MakeMoveOnTheBoard(string pieceId, string fieldId, string gameplayId)
    {
        
        await Clients.OthersInGroup(gameplayId).SendAsync("movePiece", pieceId, fieldId);
        await Clients.OthersInGroup(gameplayId).SendAsync("Unblock");
        await Clients.Caller.SendAsync("Block");
        
    }
    
    public override async Task OnConnectedAsync()
    {
        _connectionsId.Add(Context.ConnectionId);
        if (_connectionsId.Count >= 2)
        {
            await CreateGroup(); 
        }
        else
        {
            Console.WriteLine("Not sufficient users connected to create group ");  //for tests purposes
           
        }
    }

    public async Task CreateGroup()
    {
        var groupname = _connectionsId[0] + _connectionsId[1]; 
        await Groups.AddToGroupAsync(_connectionsId[0], groupname);
        await Groups.AddToGroupAsync(_connectionsId[1], groupname);
        _connectionsId.RemoveRange(0, 2);
        await Clients.Group(groupname).SendAsync("CreateGameplayId", groupname);
    }
    
}