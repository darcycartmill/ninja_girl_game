
var MAX_DIFFICULTY = 24;
var MAX_CURTAINS = 7;
var SCALE = 3;
var TILE_SIZE = 16;
var IMAGE_SIZE = TILE_SIZE * SCALE;
var GAME_X = 0;
var GAME_Y = 0;
var GAME_SPEED = 4;
var speed = IMAGE_SIZE;

var playerInAir = false;
var map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var tilesTraversed = 0;

var difficulty = 0;
var difficultyPoints = 24;

var visibleArea = 11;

var speedCount = 0;

var player = 'W';
var playerState = 0;

var gameState = "end"

var showStatus = false;
var showStatusChange = false;

// METHODS

function resetGame() {
    playerInAir = false;
    map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    tilesTraversed = 0;

    difficulty = 0;
    difficultyPoints = 24;

    visibleArea = 11;
    speedCount = 0;

    player = 'W';
    playerState = 0;

}

function processPlayerInput() {
    // IF up BUTTON WAS PRESSED
    if ((keydown.up || keydown.space) && player == 'W') {
        playerInAir = true;
    }
    if (keydown.s) {
        showStatusChange = true;
    }
    if ((keydown.up || keydown.space) && gameState == 'end') {
        resetGame();
        gameState = 'play';
    }

    
}

function generateNextTile () {
    
    var lastMap = map[map.length - 1];
    var nextMap = 0;
    
    // If difficultyPoints remain, generate nextMap value
    if (difficultyPoints > 0) {
    
        // If the last map was a hole, do not place another hole
        if (lastMap > 1) {
            nextMap = Math.floor(Math.random() * 2);
        }
        else {
            nextMap = Math.floor(Math.random() * 4);
        }
    }
    
    // Subtract the points away
    difficultyPoints = difficultyPoints - nextMap;
    
    // Return the map value
    return nextMap;
}

function updateDifficulty () {

        // Increase difficulty ever ten tiles
        if (tilesTraversed % 10 == 0) {
            difficulty++;
        }
    
        // If over max difficulty, reset to 0
        if (difficulty > MAX_DIFFICULTY) {
            difficulty = 0;
        }
        
        if (difficultyPoints <= 0) {
            difficultyPoints = difficulty;
        }
}

function updateGameLogic() {
    
    if (gameState == 'play') { 
    
        //IF speedcount was reached THEN
        if (speedCount == speed) {
            // Remove old tile from map
            map.shift();
        
            // Generate next tile and add it
            map.push(generateNextTile());
        
            // Update tiles traversed
            tilesTraversed++;
            
            // REDUCE VISIBLE AREA
        
            if (tilesTraversed % 30 == 0) { 
                if(visibleArea > 4) {
                    visibleArea--;
                }
            }
            
            updateDifficulty();
            

            // DECIDE TO END GAME?
            gameState = player == 'D' ? 'end' : 'play';
                   
            if (playerInAir) {
                player = 'J';
            }
            else {
                player = 'W';
            }
            
            if (showStatusChange) {
                showStatus = showStatus ? false : true;
                showStatusChange = false;
            }
            
            playerInAir = false;
            speedCount = -1;
        }
        
        
        // COLLISION DETECTION
        // IF player is on spikes, or on pitfall, player dies.
        
        if ((map[2] > 1 && player == 'W') || (map[2] == 1 && player == 'J')) {
            player = 'D';
        }
        

        
        speedCount++;
    }
}


function draw() {
    var canvas = document.getElementById('visible-canvas');
    var buffer = document.createElement('canvas');
    buffer.width = canvas.width;
    buffer.height = canvas.height;

    var buffer_context = buffer.getContext('2d');
    var context = canvas.getContext('2d');

    // Clear Canvas
    context.clearRect(0, 0, canvas.width, canvas.height);speedCount   


    if (gameState == "play") {
        // Draw bitmap version of map
    
        for (var i=0, len=map.length; i<len; i++ ) {
            tile = map[i];
            var top = new Image();
            var middle = new Image();
            var bottom = new Image();
        
            if (tile == 0) {
                top.src = "img/top_01.gif";
                middle.src = "img/middle_01.gif";
                bottom.src = "img/bottom_01.gif";
            }
            else if (tile == 1) {
                top.src = "img/top_02.gif";
                middle.src = "img/middle_02.gif";
                bottom.src = "img/bottom_01.gif";
            }
            else if (tile == 2) {
                top.src = "img/top_01.gif";
                middle.src = "img/middle_01.gif";
                bottom.src = "img/bottom_02.gif";
            }
            else if (tile == 3) {
                top.src = "img/top_01.gif";
                middle.src = "img/middle_01.gif";
                bottom.src = "img/bottom_03.gif";
            }
            
            buffer_context.drawImage(top, GAME_X + (i * IMAGE_SIZE) - speedCount, GAME_Y, IMAGE_SIZE, IMAGE_SIZE);
            buffer_context.drawImage(middle, GAME_X + (i * IMAGE_SIZE) - speedCount, GAME_Y + IMAGE_SIZE, IMAGE_SIZE, IMAGE_SIZE);
            buffer_context.drawImage(bottom, GAME_X + (i * IMAGE_SIZE) - speedCount, GAME_Y + IMAGE_SIZE * 2, IMAGE_SIZE, IMAGE_SIZE);
        }
        

        // Draw player
        var playerImage = new Image();
        
        if (player == 'J') {
            playerImage.src = "img/player_03.gif";
            buffer_context.drawImage(playerImage, 2 * IMAGE_SIZE - (IMAGE_SIZE/2) , GAME_Y + IMAGE_SIZE + (speedCount > IMAGE_SIZE/2  ? speedCount : IMAGE_SIZE/2 - speedCount) , IMAGE_SIZE, IMAGE_SIZE );
        }
        else if (player == 'D') {    
            var fall = 0;
            playerImage.src = "img/player_04.gif";
        
        
            if (map[2] > 1) {
                var bottom = new Image();
                bottom.src = "img/bottom_02.gif";
                buffer_context.drawImage(bottom, 2 * IMAGE_SIZE - speedCount, GAME_Y + IMAGE_SIZE * 2, IMAGE_SIZE, IMAGE_SIZE);
                fall = IMAGE_SIZE + speedCount;
                buffer_context.drawImage(playerImage, 2 * IMAGE_SIZE - (IMAGE_SIZE/2) , GAME_Y + fall * 2, IMAGE_SIZE, IMAGE_SIZE );
            }
            else {
                    buffer_context.drawImage(playerImage, 2 * IMAGE_SIZE - (IMAGE_SIZE/2) , GAME_Y + IMAGE_SIZE + (speedCount > IMAGE_SIZE/2  ? speedCount : IMAGE_SIZE/2 - speedCount) , IMAGE_SIZE, IMAGE_SIZE );
                }
        }
        else {
            if(speedCount == 0 || 
                speedCount == IMAGE_SIZE/4 ||
                speedCount == IMAGE_SIZE/2 ||
                speedCount == IMAGE_SIZE/4 * 3) {
                playerState = playerState ? 0 : 1;
            }
            
            if (playerState) {
                playerImage.src = "img/player_01.gif";
            } 
            else
            {
                playerImage.src = "img/player_02.gif";
            }
            buffer_context.drawImage(playerImage, 2 * IMAGE_SIZE - (IMAGE_SIZE/2), (GAME_Y + IMAGE_SIZE * 2), IMAGE_SIZE, IMAGE_SIZE);
        }
        
        // DRAW CURTAINS
        for (var i=visibleArea; i < map.length - 1; i++ ) {
            var top = new Image();
            var middle = new Image();
            var bottom = new Image();
            
            top.src = "img/top_04.gif";
            middle.src = "img/middle_04.gif";
            bottom.src = "img/bottom_04.gif";
        
            buffer_context.drawImage(top, GAME_X + (i * IMAGE_SIZE), GAME_Y, IMAGE_SIZE, IMAGE_SIZE);
            buffer_context.drawImage(middle, GAME_X + (i * IMAGE_SIZE), GAME_Y + IMAGE_SIZE, IMAGE_SIZE, IMAGE_SIZE);
            buffer_context.drawImage(bottom, GAME_X + (i * IMAGE_SIZE), GAME_Y + IMAGE_SIZE * 2, IMAGE_SIZE, IMAGE_SIZE);
        }
        
        // DRAW ANIMATION HIDING PANELS
        
        buffer_context.fillStyle = "#000"; // Set color to black
        buffer_context.fillRect(GAME_X, GAME_Y , IMAGE_SIZE, IMAGE_SIZE * 3);
        buffer_context.fillRect(GAME_X + ((map.length - 1) * IMAGE_SIZE), GAME_Y , IMAGE_SIZE, IMAGE_SIZE * 3);
        buffer_context.fillRect(GAME_X, GAME_Y + IMAGE_SIZE * 3 , map.length * IMAGE_SIZE, IMAGE_SIZE * 3);

        
        // Draw Status
        if (showStatus) {
            buffer_context.fillStyle = "#FFF"; // Set color to white
            buffer_context.fillText("MAP: " + map.toString(), GAME_X + IMAGE_SIZE, GAME_Y + IMAGE_SIZE * 3 + 30);
            buffer_context.fillText("PLAYER STATE: " + player,GAME_X + IMAGE_SIZE, GAME_Y + IMAGE_SIZE * 3 + 20);
            buffer_context.fillText("SPEEDCOUNT: " + speedCount, GAME_X + IMAGE_SIZE + 100, GAME_Y + IMAGE_SIZE * 3 + 20);
            buffer_context.fillText("TILES TRAVERSED: " + tilesTraversed, GAME_X + IMAGE_SIZE, GAME_Y + IMAGE_SIZE * 3 + 40);
            buffer_context.fillText("VISIBLE AREA: " + visibleArea, GAME_X + IMAGE_SIZE, GAME_Y + IMAGE_SIZE * 3 +50);
        
        }
    }
    else if (gameState = 'end' ) {
        // END/START screen
        
        buffer_context.fillStyle = "#000"; // Set color to black
        buffer_context.fillRect(GAME_X, GAME_Y, IMAGE_SIZE * map.length, IMAGE_SIZE * 6);
        buffer_context.fillStyle = "#FFF"; // Set color to white
        buffer_context.fillText("NINJA GIRL GAME  V 0.065", GAME_X + IMAGE_SIZE, GAME_Y + IMAGE_SIZE + 30);
        buffer_context.fillText("How to play,", GAME_X + IMAGE_SIZE, GAME_Y + IMAGE_SIZE + 50);
        buffer_context.fillText("Navigate ninja girl through the dungeon. Avoid traps!", GAME_X + IMAGE_SIZE, GAME_Y + IMAGE_SIZE + 70);
        buffer_context.fillText("Press [spacebar] or [up] button to JUMP over obstacles", GAME_X + IMAGE_SIZE, GAME_Y + IMAGE_SIZE + 90);
        buffer_context.fillText("JUMP over holes and trap doors!", GAME_X + IMAGE_SIZE, GAME_Y + IMAGE_SIZE + 110);
        buffer_context.fillText("DON'T JUMP into spikes", GAME_X + IMAGE_SIZE, GAME_Y + IMAGE_SIZE + 130);
        buffer_context.fillText("Curtains will obstruct your view the more you progress.", GAME_X + IMAGE_SIZE, GAME_Y + IMAGE_SIZE + 150);
        
        
        var trap = new Image();        
         
        trap.src = "img/bottom_02.gif";               
        buffer_context.drawImage(trap, 350, GAME_Y + 80 + IMAGE_SIZE * 2, IMAGE_SIZE, IMAGE_SIZE);
        buffer_context.fillText("DEATH PIT", 350, GAME_Y + 90 + IMAGE_SIZE * 3);
        
        trap.src = "img/bottom_03.gif";               
        buffer_context.drawImage(trap, 450, GAME_Y + 80 + IMAGE_SIZE * 2, IMAGE_SIZE, IMAGE_SIZE);
        buffer_context.fillText("TRAP DOOR", 450, GAME_Y + 90 + IMAGE_SIZE * 3);
        
        trap.src = "img/top_02.gif";               
        buffer_context.drawImage(trap, 350, GAME_Y + 70, IMAGE_SIZE, IMAGE_SIZE);
        buffer_context.drawImage(trap, 350 + IMAGE_SIZE, GAME_Y + 70, IMAGE_SIZE, IMAGE_SIZE);
        trap.src = "img/middle_02.gif";               
        buffer_context.drawImage(trap, 350, GAME_Y + 70 + IMAGE_SIZE, IMAGE_SIZE, IMAGE_SIZE);
        buffer_context.drawImage(trap, 350 + IMAGE_SIZE, GAME_Y + 70 + IMAGE_SIZE, IMAGE_SIZE, IMAGE_SIZE);
        buffer_context.fillText("SPIKE TRAP", 350, GAME_Y + 70);
        
                                 
        buffer_context.fillText("Created by Darcy Cartmill 2011", GAME_X + IMAGE_SIZE , IMAGE_SIZE * 5 + IMAGE_SIZE/2);
    buffer_context.fillText("<darcy.cartmill@gmail.com>", GAME_X + IMAGE_SIZE , IMAGE_SIZE * 5 + IMAGE_SIZE/2 + 10);
                                                             
        buffer_context.fillText("<Press [spacebar] or [up] button to begin>", IMAGE_SIZE * map.length - 250, IMAGE_SIZE * 5 + IMAGE_SIZE/2);

    }
    
    context.drawImage(buffer, 0, 0);
}

function updateGame() {
    processPlayerInput();
    updateGameLogic();
    draw();
    setTimeout(updateGame, GAME_SPEED);
}
