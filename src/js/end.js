// Estado final "End"

var end = {
    preload: function () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; // Escala la imagen al reducir el tamaño de la ventana
        this.stage.backgroundColor = "#FFFFFF"; // Color de fondo
        this.load.bitmapFont(
            "carrier_command",
            "src/assets/fonts/carrier_command.png",
            "src/assets/fonts/carrier_command.xml"
        ); // Se agrega fuente de letra
        this.load.image("space", "src/assets/img/space.png"); // Imagen fondo
        this.load.image("button", "src/assets/img/rocket.png"); // Imagen boton
        this.load.image("volver", "src/assets/img/volver.png"); // Texto boton
    },

    create: function () {
        this.add.image(0, 0, "space"); // Agrega imagen de fondo
        var button = this.add.button(670, 480, "button", this.main, this); // Asigna la función main al botón
        var volver = this.add.button(240, 475, "volver", this.main, this); // Asigna la función main al texto del botón

        this.add.bitmapText(40, 50, "carrier_command", `Juego finalizado!`, 28);
        button.scale.setTo(0.2); // Escala tamaño del botón
        volver.scale.setTo(0.8); // Escala tamaño del texto del boton
    },

    main: function () {
        this.state.start("start"); // Lleva al estado start, reiniciando el juego
    },
};
