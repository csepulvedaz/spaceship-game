// Estado inicial "Start"

var start = {
    // Funcion preload
    preload: function () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; // Escala la imagen al reducir el tamaño de la ventana
        this.stage.backgroundColor = "#FFFFFF"; // Color de fondo
        this.load.bitmapFont(
            "carrier_command",
            "src/assets/fonts/carrier_command.png",
            "src/assets/fonts/carrier_command.xml"
        ); // Se carga la fuente de letra
        this.load.image("space", "src/assets/img/space.png"); // Imagen fondo
        this.load.image("button", "src/assets/img/rocket.png"); // Imagen boton
        this.load.image("iniciar", "src/assets/img/iniciar.png"); // Texto boton
        this.load.image("keyboard", "src/assets/img/arrow-keys.png"); // Controles
    },
    //Funcion create
    create: function () {
        this.add.image(0, 0, "space");
        var button = this.add.button(670, 480, "button", this.begin, this); // Asigna la función begin al botón
        var iniciar = this.add.button(490, 510, "iniciar", this.begin, this); // Asigna la función begin al texto del botón
        var keyboard = this.add.image(40, 490, "keyboard"); // Asigna la función begin al texto del botón

        this.add.bitmapText(
            40,
            50,
            "carrier_command",
            `Bienvenido astronauta!`,
            28
        ); // Texto de bienvenida
        this.add.bitmapText(
            40,
            120,
            "carrier_command",
            `Estas perdido en el espacio! \n\ntienes que encotrar el camino a \n\ncasa pronto, se acaba el tiempo. \n\nSigue los portales y no olvides \n\nrecolectar las llaves para \n\npoder entrar a ellos. \n\n\n\nBuena suerte viajero.`,
            20
        ); // Contexto
        button.scale.setTo(0.2); // Escala tamaño del botón
        iniciar.scale.setTo(0.8); // Escala tamaño del texto del boton
        keyboard.scale.setTo(0.18); // Escala tamaño de los controles
    },

    begin: function () {
        this.state.start("stage1"); // LLeva al stage 1
    },
};
