// Stage 3

var timer;
var delay = 2000; // Delay de 2 segundos
var collected1 = 0;
var leftMove = false;
var upMove = false;
var botMove = false;
var rightMove = false;

var stage3 = {
    preload: function () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; // Escala la imagen al reducir el tamaño de la ventana
        this.load.bitmapFont(
            "carrier_command",
            "src/assets/fonts/carrier_command.png",
            "src/assets/fonts/carrier_command.xml"
        ); // Se agrega la fuente de texto
        this.load.image("background", "src/assets/img/space3.jpg");
        this.load.image("spaceship", "src/assets/img/planet-express.png"); // Imagen de la nave
        this.load.image("key", "src/assets/img/key.png"); // Imagen de las llaves
        this.load.image("alien", "src/assets/img/alien.png"); // Imagen del alien
        this.load.image("left", "src/assets/img/left.png"); // Imagen tecla izquierda
        this.load.image("up", "src/assets/img/up.png"); // Imagen tecla arriba
        this.load.image("bot", "src/assets/img/bot.png"); // Imagen tecla abajo
        this.load.image("right", "src/assets/img/right.png"); // Imagen tecla derecha
    },

    create: function () {
        bg = game.add.tileSprite(0, 0, 800, 400, "background"); // Imagen de fondo
        bg.scale.setTo(1.5); // Se escala el fondo

        // Se agregan botones de movimiento para el touch en movil
        left = this.add.button(
            game.width * 0.72,
            game.height * 0.87,
            "left",
            null,
            this
        ); // Se agrega flecha izquierda
        up = this.add.button(
            game.width * 0.81,
            game.height * 0.75,
            "up",
            null,
            this
        ); // Se agrega flecha arriba
        bot = this.add.button(
            game.width * 0.81,
            game.height * 0.87,
            "bot",
            null,
            this
        ); // Se agrega flecha abajo
        right = this.add.button(
            game.width * 0.905,
            game.height * 0.87,
            "right",
            null,
            this
        ); // Se agrega flecha derecha
        left.scale.setTo(0.3); // Se escalan todos los botones de flechas
        up.scale.setTo(0.3);
        bot.scale.setTo(0.3);
        right.scale.setTo(0.3);
        left.onInputDown.add(this.leftDown, this); // Se agrega evento de presionar el boton en cada boton
        left.onInputUp.add(this.leftUp, this); // Se agrega evento de soltar el boton en cada boton
        up.onInputDown.add(this.upDown, this);
        up.onInputUp.add(this.upUp, this);
        bot.onInputDown.add(this.botDown, this);
        bot.onInputUp.add(this.botUp, this);
        right.onInputDown.add(this.rightDown, this);
        right.onInputUp.add(this.rightUp, this);

        auxKeys = game.add.group(); // Se agregan las teclas en un grupo para el orden de display
        auxKeys.add(left);
        auxKeys.add(up);
        auxKeys.add(bot);
        auxKeys.add(right);

        spaceship = this.add.sprite(30, 490, "spaceship"); // Se agrega la nave
        spaceship.scale.setTo(0.2); // Se escala el tamaño de la nave

        text = this.add.bitmapText(
            20,
            20,
            "carrier_command",
            `Llaves recogidas 0/10`,
            15
        ); // Texto de puntuacion

        righkey = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT); // Activa la tecla flecha derecha
        leftkey = this.input.keyboard.addKey(Phaser.Keyboard.LEFT); // Activa la tecla flecha izquierda
        upkey = this.input.keyboard.addKey(Phaser.Keyboard.UP); // Activa la tecla flecha arriba
        downkey = this.input.keyboard.addKey(Phaser.Keyboard.DOWN); // Activa la tecla flecha abajo

        spaceship.enableBody = true; // El objeto toma cuerpo
        this.physics.enable(spaceship, Phaser.Physics.ARCADE); // Activa las fisicas en la nave

        spaceship.body.collideWorldBounds = true; // La nave no puede salir de los limites de la ventana
        spaceship.body.bounce.set(0.3, 0.3); // Propiedades de rebote

        //Timer incial
        timer = game.time.create(false);
        timer.start(); // Empieza el timer

        // Grupos aliens y llaves
        aliens = game.add.group();
        allKeys = game.add.group();

        items = game.add.group(); // Se agregan los items en un grupo para el orden de display
        items.add(allKeys);
        items.add(aliens);
        items.add(spaceship);

        game.world.swap(auxKeys, items); // Sobrepone las teclas
    },

    update: function () {
        if (leftkey.isDown || leftMove) {
            // Reconoce la tecla flecha izquierda y aumenta la velocidad de la nave hacia la izquierda
            spaceship.body.velocity.x -= 10;
        }
        if (righkey.isDown || rightMove) {
            // Reconoce la tecla flecha derecha y aumenta la velocidad de la nave hacia la derecha
            spaceship.body.velocity.x += 10;
        }
        if (upkey.isDown || upMove) {
            // Reconoce la tecla flecha arriba y aumenta la velocidad de la nave hacia arriba
            spaceship.body.velocity.y -= 10;
        }
        if (downkey.isDown || botMove) {
            // Reconoce la tecla flecha abajo y aumenta la velocidad de la nave hacia abajo
            spaceship.body.velocity.y += 10;
        }
        bg.tilePosition.x -= 2.5; // Se mueve el fondo
        this.sendAlien(); // Envia los alien
        this.updateCollisions(); // Detecta colisiones de la nave con aliens
        this.collectKeys(); // Detecta cuando la nave recoge llaves
        this.final(); // Termina el nivel
    },

    collectKeys: function () {
        allKeys.forEach(function (keys) {
            // Si la nave pasa encima de una llave
            if (game.physics.arcade.overlap(spaceship, keys)) {
                collected1++; // Se aumenta el numero de llaves recolectadas
                text.setText(`Llaves recogidas ${collected1}/10`); // Se imprimen en pantalla las llaves
                allKeys.removeChild(keys); // Se sacan las llaves del grupo y se eliminan
            }
        });
    },

    sendAlien: function () {
        // Cada dos segundos se cumple la condicion
        if (timer.ms > delay) {
            var index = game.rnd.between(0, 8); //Numero aleatorio
            var alien = game.add.sprite(
                game.width,
                game.rnd.between(60, game.height * 0.9),
                "alien"
            ); // Se imprime alien
            alien.anchor.setTo(0, 0.9); // Posiciona el alien
            alien.scale.setTo(0.2); //Escala la imagen del alien
            game.physics.arcade.enable(alien); // Adiciona fisicas al alien
            alien.body.velocity.x = -250; // Setea velocidad alien
            alien.body.immovable = false; //El alien no se puede mover
            alien.body.outOfBoundsKill = true; // Se elimina el alien al salir del recuadro

            var key = game.add.sprite(
                game.width,
                game.rnd.between(60, game.height * 0.9) + index * 10,
                "key"
            ); // Imprime una llave
            key.anchor.setTo(0, 0.9); // Posiciona la llave
            key.scale.setTo(0.1); // Escala la imagen de la llave
            game.physics.arcade.enable(key); // Se agregan fisicas a la llave
            key.body.velocity.x = -100; // Setea velocidad llave
            key.body.immovable = false; // La llave no se puede mover
            key.body.outOfBoundsKill = true; // Se elimina la llave al salir
            aliens.add(alien); // Se agrega el alien al grupo
            allKeys.add(key); // Se agrega la llave al grupo

            timer = game.time.create(false); // Se crea un nuevo timer
            timer.start(); // Se inicia el timer
            delay = game.rnd.between(2000, 4000); // Se actualiza el delay en aleatorio entre 2000 y 4000
        }
    },

    updateCollisions: function () {
        // Si colisiona la nave con un alien se reinicia
        if (game.physics.arcade.collide(spaceship, aliens)) {
            game.state.start("stage3"); // Reinicia el nivel
            collected1 = 0; // Se reinicia el valor
        }
    },

    final: function () {
        // Si recolecta las 10 llaves se acaba el juego
        if (collected1 === 10) {
            game.state.start("end"); // Termina el juego
            collected1 = 0; // Se reinicia el valor
        }
    },
    // Se agregan funciones que detectan eventos en las funciones
    leftDown: function () {
        leftMove = true; // Verdadero para moverser
    },
    leftUp: function () {
        leftMove = false; // Falso para dejar de moverse
    },
    upDown: function () {
        upMove = true;
    },
    upUp: function () {
        upMove = false;
    },
    botDown: function () {
        botMove = true;
    },
    botUp: function () {
        botMove = false;
    },
    rightDown: function () {
        rightMove = true;
    },
    rightUp: function () {
        rightMove = false;
    },
};
