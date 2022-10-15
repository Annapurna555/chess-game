"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/GameplayHub").build();
const chessPieces = document.querySelectorAll('.white-piece, .black-piece')
const chessFields = document.querySelectorAll('.black, .white')
let pieceIdDraggedByUser;
let fieldIdWhereUserDropThePiece;
let gameplayId;

connection.on("movePiece", (pieceId, fieldId)=>{
    transferPieceForSecondPlayer(pieceId, fieldId)
})

connection.on("CreateGameplayId", function (gameId) {
    const p = document.getElementById("game-id");
    p.innerHTML = gameId
    gameplayId = gameId;
    document.getElementById("game-id").appendChild(p);
});

connection.on("Block", ()=>{
    document.querySelectorAll('.white-piece, .black-piece').forEach((elem) => {
        elem.draggable = false;
    })
})

connection.on("Unblock", ()=>{
    document.querySelectorAll('.white-piece, .black-piece').forEach((elem) => {
        elem.draggable = true;
    })
})

connection.start().then(function () {

}).catch(function (err) {
    return console.error(err.toString());
});


chessPieces.forEach(field =>{
    field.addEventListener('drag', function handleClick(event){
        dragStart(event)
    })
})

chessFields.forEach(field =>{
    field.addEventListener('dragover', function handleClick(event){
        allowDrop(event)
        event.preventDefault()
    })
    field.addEventListener('drop', function handleClick(event){
        dragDrop(event)
        connection.invoke("MakeMoveOnTheBoard", pieceIdDraggedByUser, fieldIdWhereUserDropThePiece, gameplayId).catch(function (err) {
            return console.error(err.toString());
        });
    })
})


function allowDrop(ev) {
    ev.preventDefault();
}

function dragStart(ev) {
    pieceIdDraggedByUser = ev.target.id
}

function dragDrop(ev) {
    fieldIdWhereUserDropThePiece = ev.target.id
    const piece = document.getElementById(pieceIdDraggedByUser)
    const field = document.getElementById(fieldIdWhereUserDropThePiece)
    ev.preventDefault();
    ev.target.appendChild(piece);
    field.appendChild(piece)
}

function transferPieceForSecondPlayer(pieceId, fieldId){
    const piece = document.getElementById(pieceId)
    const field = document.getElementById(fieldId)
    field.appendChild(piece)
}

