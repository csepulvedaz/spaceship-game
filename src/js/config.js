//Configuracion
var config = {
    type: Phaser.AUTO, // La documentacion recomienda poner type Phaser.AUTO
    width: 800, // Ancho
    height: 600, // Alto
    parent: "game", // Identificador en el DOM
};

var game = new Phaser.Game(config); // Se instancia un nuevo objeto Phaser.Game

game.state.add("start", start); // Se agregan estados
game.state.add("stage1", stage1);
game.state.add("stage2", stage2);
game.state.add("stage3", stage3);
game.state.add("end", end);

game.state.start("start"); // Inicia en juego
