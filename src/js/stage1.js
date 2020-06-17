//  Stage 1

var collected = 0;
var leftMove = false;
var upMove = false;
var botMove = false;
var rightMove = false;

var stage1 = {
    preload: function () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; // Escala la imagen al reducir el tamaño de la ventana
        this.load.bitmapFont(
            "carrier_command",
            "src/assets/fonts/carrier_command.png",
            "src/assets/fonts/carrier_command.xml"
        ); // Se agrega la fuente de texto
        this.load.image("spaceship", "src/assets/img/planet-express.png"); // Imagen de la nave
        this.load.image("key", "src/assets/img/key.png"); // Imagen de las llaves
        this.load.image("space2", "src/assets/img/space2.png"); // Imagen fondo
        this.load.image("asteroid", "src/assets/img/asteroid.png"); // Imagen asteroide
        this.load.image("left", "src/assets/img/left.png"); // Imagen tecla izquierda
        this.load.image("up", "src/assets/img/up.png"); // Imagen tecla arriba
        this.load.image("bot", "src/assets/img/bot.png"); // Imagen tecla abajo
        this.load.image("right", "src/assets/img/right.png"); // Imagen tecla derecha
        this.load.spritesheet(
            "portal",
            "src/assets/img/portal.png",
            250,
            592,
            4
        ); // Imagen del portal
    },

    create: function () {
        this.add.image(0, 0, "space2"); // Se agrega la imagen de fondo
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

        portal = this.add.sprite(700, 50, "portal"); // Se agrega la imagen del portal
        portal.animations.add("exit"); // Se agrega animacion del portal
        portal.animations.play("exit", 8, true); // Se repoduce animacion del portal
        portal.scale.setTo(0.2); // Escala tamaño del portal

        text = this.add.bitmapText(
            20,
            20,
            "carrier_command",
            `Llaves recogidas 0/5`,
            15
        ); // Texto de puntuacion
        this.physics.enable(text, Phaser.Physics.ARCADE); // Fisicas al texto para que se vea siempre
        text.body.immovable = true; // Que no se mueva si algo lo choca

        spaceship = this.add.sprite(30, 490, "spaceship"); // Se agrega la nave
        spaceship.scale.setTo(0.2); // Se escala el tamaño de la nave

        righkey = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT); // Activa la tecla flecha derecha
        leftkey = this.input.keyboard.addKey(Phaser.Keyboard.LEFT); // Activa la tecla flecha izquierda
        upkey = this.input.keyboard.addKey(Phaser.Keyboard.UP); // Activa la tecla flecha arriba
        downkey = this.input.keyboard.addKey(Phaser.Keyboard.DOWN); // Activa la tecla flecha abajo

        spaceship.enableBody = true; // El objeto toma cuerpo
        this.physics.enable(spaceship, Phaser.Physics.ARCADE); // Activa las fisicas en la nave
        this.physics.enable(portal, Phaser.Physics.ARCADE); // Activa las fisicas en el portal

        spaceship.body.collideWorldBounds = true; // La nave no puede salir de los limites de la ventana
        spaceship.body.bounce.set(0.3, 0.3); // Propiedades de rebote

        allKeys = game.add.group(); // Se agrega un grupo de llaves
        asteroids = game.add.group(); // Se agrega un grupo de asteroides
        for (a = 0; a < 10; a++) {
            // Se crean 5 llaves aleatoriamente
            if (a < 5) {
                keys = this.add.sprite(
                    game.rnd.between(game.width * 0.1, game.width * 0.9),
                    game.rnd.between(60, game.height * 0.9),
                    "key"
                );
                keys.anchor.setTo(0.5); // Se centran las llaves
                keys.scale.setTo(0.1); // Se escalan las llaves
                this.physics.arcade.enable(keys); // Se agregan fisicas a las llaves
                allKeys.add(keys); //Se agregan las llaves al grupo
            }

            // Se crean 5 asteroides aleatoriamente
            asteroid = this.add.sprite(
                game.rnd.between(game.width * 0.1, game.width),
                game.rnd.between(70, game.height * 0.9),
                "asteroid"
            );
            asteroid.anchor.setTo(0.5); // Se centran los asteroides
            asteroid.scale.setTo(0.2); // Se escalan los asteroides
            this.physics.arcade.enable(asteroid); // Se agregan fisicas a los asteroides
            asteroid.body.collideWorldBounds = true; // Los asteroides chocan con los limites
            asteroid.body.bounce.set(0.3, 0.3); // Los asteroides rebotan al chocar con los limites
            asteroids.add(asteroid); //Se agregan las asteroides al grupo
        }

        items = game.add.group(); // Se agregan los items en un grupo para el orden de display
        items.add(allKeys);
        items.add(asteroids);
        items.add(spaceship);

        game.world.swap(auxKeys, items); // Sobrepone las teclas
    },

    update: function () {
        if (leftkey.isDown || leftMove) {
            // Reconoce la tecla flecha izquierda y aumenta la velocidad de la nave hacia la izquierda
            spaceship.body.velocity.x -= 5;
        }
        if (righkey.isDown || rightMove) {
            // Reconoce la tecla flecha derecha y aumenta la velocidad de la nave hacia la derecha
            spaceship.body.velocity.x += 5;
        }
        if (upkey.isDown || upMove) {
            // Reconoce la tecla flecha arriba y aumenta la velocidad de la nave hacia arriba
            spaceship.body.velocity.y -= 5;
        }
        if (downkey.isDown || botMove) {
            // Reconoce la tecla flecha abajo y aumenta la velocidad de la nave hacia abajo
            spaceship.body.velocity.y += 5;
        }
        game.physics.arcade.collide(asteroids, asteroids); // Detecta si choca un asteroide con un asteroide
        game.physics.arcade.collide(spaceship, asteroids); // Detecta si la nave choca con un asteroide
        game.physics.arcade.collide(spaceship, text); // Detecta si la nave choca con el texto
        game.physics.arcade.collide(asteroids, text); // Detecta si un asteroide choca con el texto
        this.collectKeys(); // Dectecta si la nave recoge una llave
        this.enterPortal(); // Detecta si la nave entra en el portal
    },
    collectKeys: function () {
        allKeys.forEach(function (keys) {
            if (game.physics.arcade.overlap(spaceship, keys)) {
                collected++; // Se aumenta el numero de llaves recolectadas
                text.setText(`Llaves recogidas ${collected}/5`); // Se imprimen en pantalla las llaves
                allKeys.removeChild(keys); // Se sacan las llaves del grupo y se eliminan
            }
        });
    },
    enterPortal: function () {
        if (game.physics.arcade.overlap(spaceship, portal) && collected === 5) {
            // Si se recogieron todas las llaves y se entra al portal se puede pasar al siguiente stage
            game.state.start("stage2"); // Pasa al stage2
            collected = 0; // Reinicia el contador
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
