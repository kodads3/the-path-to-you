const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

// CONFIGURACIÓN DEL JUEGO

const TILE = 32;
const COLS = 30;
const ROWS = 20;

// VELOCIDAD DEL PERSONAJE

const MOVE_DELAY = 160;
let lastMoveTime = 0;

const SAVE_KEY = "thePathToYou_save";
let collectedObjects = [];
let currentMission = "Habla con el Viajero";
let missionCompleted = false;
let currentMap = "village";
let forestUnlocked = false;
let gameCompleted = false;

// IMAGEN DE LA PROTAGONISTA

const protagonistSprite = new Image();
protagonistSprite.src = "assets/characters/protagonista.PNG";

// Skin de Desconocido
const desconocidoSkin = new Image();
desconocidoSkin.src = "assets/characters/desconocido.png";

// Skin del Viajero
const viajeroSkin = new Image();
viajeroSkin.src = "assets/characters/viajero.png";

// Skin de la Guardiana de los Recuerdos
const guardianaSkin = new Image();
guardianaSkin.src = "assets/characters/guardiana.png";

// Skin de Gabriel para el encuentro final
const gabrielSkin = new Image();
gabrielSkin.src = "assets/characters/gabriel.png";

// PERSONAJE PROVISIONAL

const player = {
    x: 4,
    y: 10,

    // Posición visual
    pixelX: 4 * TILE,
    pixelY: 10 * TILE,

    // Dirección
    facing: "down",

    // Movimiento
    targetX: 4 * TILE,
    targetY: 10 * TILE,
    moving: false,

    walkFrame: 0,
    animationCounter: 0
};
// ELEMENTOS DEL ESCENARIO

const trees = [
    [2, 3], [8, 3], [10, 5],
    [5, 13], [9, 15], [19, 4],
    [25, 11], [23, 15], [27, 5],
    [18, 16], [3, 17]
];

const forestTrees = [
    // Zona superior
    [2, 1], [5, 1], [13, 1], [17, 1], [22, 1], [26, 1],
    [3, 3], [7, 3], [11, 3], [16, 3], [21, 3], [27, 3],

    // Zona media superior
    [1, 6], [5, 6], [14, 6], [19, 6], [24, 6], [28, 6],

    // Zona central
    [3, 9], [7, 9], [13, 10], [17, 9], [22, 9], [27, 9],

    // Zona media inferior
    [1, 12], [5, 12], [10, 12], [15, 12], [20, 12], [25, 12], [28, 12],

    // Zona inferior
    [3, 15], [7, 15], [12, 15], [17, 15], [22, 15], [27, 15],

    // Última fila
    [2, 18], [6, 18], [11, 18], [16, 18], [21, 18], [26, 18]
];

const forestFireflies = [
    { x: 5, y: 4, size: 2, speed: 0.8 },
    { x: 11, y: 6, size: 3, speed: 1.1 },
    { x: 18, y: 3, size: 2, speed: 0.7 },
    { x: 24, y: 8, size: 3, speed: 1.2 },
    { x: 4, y: 10, size: 2, speed: 0.9 },
    { x: 14, y: 11, size: 3, speed: 0.6 },
    { x: 21, y: 13, size: 2, speed: 1.0 },
    { x: 27, y: 16, size: 3, speed: 0.8 },
    { x: 9, y: 17, size: 2, speed: 1.3 },
    { x: 17, y: 18, size: 2, speed: 0.7 }
];

const forestLeaves = [
    { x: 4, y: 2, speed: 0.8, color: "#a8bd65" },
    { x: 9, y: 5, speed: 1.1, color: "#d5b85e" },
    { x: 15, y: 3, speed: 0.7, color: "#8eae59" },
    { x: 23, y: 4, speed: 1.2, color: "#d9c77b" },
    { x: 27, y: 8, speed: 0.9, color: "#a8bd65" },
    { x: 6, y: 10, speed: 1.3, color: "#c9a85b" },
    { x: 13, y: 7, speed: 0.8, color: "#8eae59" },
    { x: 20, y: 12, speed: 1.0, color: "#d5b85e" },
    { x: 25, y: 15, speed: 0.7, color: "#a8bd65" },
    { x: 3, y: 16, speed: 1.1, color: "#d9c77b" },
    { x: 17, y: 17, speed: 0.9, color: "#8eae59" },
    { x: 22, y: 18, speed: 1.2, color: "#c9a85b" }
];

const seaObjects = [
    { x: 3, y: 9, type: "rock" },

    { x: 6, y: 13, type: "palm" },
    { x: 11, y: 16, type: "palm" },

    { x: 15, y: 10, type: "rock" },

    { x: 20, y: 14, type: "palm" },
    { x: 24, y: 17, type: "palm" },

    { x: 25, y: 9, type: "rock" },

    { x: 27, y: 16, type: "palm" },
    { x: 4, y: 17, type: "palm" },
    { x: 15, y: 13, type: "palm" },
    { x: 10, y: 9, type: "palm" },
    { x: 2, y: 11, type: "palm" },
    { x: 22, y: 10, type: "palm" }
];

const mountainObjects = [

    // Rocas de la parte superior izquierda
    { x: 1, y: 2, type: "rock" },
    { x: 5, y: 3, type: "rock" },
    { x: 2, y: 5, type: "rock" },
    { x: 6, y: 6, type: "rock" },

    // Rocas de la parte central izquierda
    { x: 1, y: 10, type: "rock" },
    { x: 5, y: 11, type: "rock" },
    { x: 2, y: 14, type: "rock" },

    // Rocas de la parte inferior izquierda
    { x: 4, y: 16, type: "rock" },
    { x: 1, y: 18, type: "rock" },
    { x: 7, y: 18, type: "rock" },

    // Rocas que conservamos en el resto del mapa
    { x: 12, y: 6, type: "rock" },
    { x: 18, y: 4, type: "rock" },
    { x: 24, y: 7, type: "rock" },
    { x: 13, y: 15, type: "rock" },
    { x: 21, y: 12, type: "rock" },
    { x: 26, y: 16, type: "rock" }
];

const mountainCollectibles = [
    {
        x: 7,
        y: 10,
        name: "Primer fragmento de estrella",
        collected: false,
        message: "Primera estrella: Incluso cuando alguien está lejos, su recuerdo puede convertirse en la luz que ilumina nuestros días más oscuros."
    },
    {
        x: 19,
        y: 6,
        name: "Segundo fragmento de estrella",
        collected: false,
        message: "Segunda estrella: Hay personas que, sin importar cuántos kilómetros nos separen, siempre encuentran la manera de sentirse cerca."
    },
    {
        x: 25,
        y: 14,
        name: "Tercer fragmento de estrella",
        collected: false,
        message: "Tercera estrella: Después de tantos caminos, tantos recuerdos y tanta distancia, estás a un solo paso de descubrir por qué valió la pena continuar."
    }
];


const mountainMessage = {
    x: 15,
    y: 1,
    name: "El último mensaje",
    collected: false,
    message: "Has recorrido bosques, atravesado mares y seguido la luz de las estrellas. Cada recuerdo, cada perla y cada fragmento te ha traído hasta este instante. Quizás todavía no lo sepas, pero nunca estuviste recorriendo este camino sin un motivo. Al final de él hay alguien que tiene algo que lleva mucho tiempo queriendo decirte..."
};

const finalCharacter = {
    x: 15,
    y: 5,
    name: "Gabriel",
    dialogues: [
        "Al fin... Después de tanto tiempo imaginando este momento, por fin has llegado.",
        "Cada lugar que recorriste guardaba una pequeña parte de algo que quería contarte.",
        "Quería que supieras que, aunque existan kilómetros entre nosotros, nunca he dejado de encontrar motivos para acercarme a ti.",
        "Y si alguna vez vuelves a sentir que estamos lejos, recuerda que siempre habrá una parte de mí esperándote aquí.",
        "Te amo Valentina."
    ],

    currentDialogue: 0
};

const finalLetter = {
    x: 15,
    y: 8,
    name: "Carta final",
    collected: false,
    title: "Para ti, que recorriste todo este camino...",
    message: "Si has llegado hasta aquí, significa que recorriste cada sendero, atravesaste bosques, cruzaste mares y seguiste las estrellas sin saber exactamente qué encontrarías al final. Quizás durante el viaje te preguntaste por qué había tantos recuerdos escondidos, por qué el mar guardaba aquellos mensajes o por qué las estrellas parecían señalarte un único destino. La respuesta era sencilla: quería llevarte hasta aquí. Quería que, aunque fuera por un instante, pudieras recorrer un camino que construí pensando en ti.\n\nHay algo que quisiera que supieras. A veces me cuesta encontrar las palabras adecuadas para explicar lo que significas para mí. Hay sentimientos que parecen demasiado grandes para caber en una carta, y otros que ni siquiera las canciones que tanto me gustan consiguen expresar por completo.\n\nPero si algo he aprendido es que la distancia no siempre significa estar lejos. Porque estás presente en mis pensamientos, en las canciones que escucho, en las pequeñas cosas que me gustaría compartir contigo y en todos esos momentos en los que desearía poder acortar los kilómetros con tan solo extender la mano.\n\nOjalá algún día no necesitemos caminos imaginarios para encontrarnos. Ojalá podamos caminar juntos, descubrir lugares nuevos, compartir silencios, reírnos de cualquier tontería y convertir en recuerdos reales todas esas cosas que hoy solo podemos imaginar.\n\nHasta entonces, quiero seguir construyendo contigo esta historia. Sin importar cuántos kilómetros haya entre nosotros, siempre habrá algo que me recuerde por qué vale la pena recorrer cualquier distancia.\n\nY si tuviera que comenzar este viaje mil veces, sabiendo que al final volvería a encontrarte, elegiría el mismo camino una y otra vez.\n\nGracias por existir, por llegar a mi vida y por ser esa persona a la que, incluso en la distancia, siempre encuentro motivos para elegir.\n\nCon todo mi cariño,\n\nSiempre tuyo: Gabriel."
};


const seaCollectibles = [
    {
        x: 10,
        y: 10,
        name: "Primera perla",
        collected: false,
        message: "Primera perla: A veces esperar no significa quedarse quieto, sino seguir creyendo que algo bonito llegará."
    },
    {
        x: 17,
        y: 15,
        name: "Segunda perla",
        collected: false,
        message: "Segunda perla: El mar puede separar dos orillas, pero no puede borrar aquello que une a dos corazones."
    },
    {
        x: 24,
        y: 12,
        name: "Tercera perla",
        collected: false,
        message: "Tercera perla: Quizás no puedas acortar todos los kilómetros, pero cada paso que das demuestra que vale la pena llegar."
    }
];


const seaMessage = {
    x: 15,
    y: 9,
    name: "Mensaje del océano",
    collected: false,
    message: "El mar guarda silencio mientras lees las palabras que aparecen en el mensaje: «Hay distancias que no se miden en kilómetros, sino en todo aquello que estamos dispuestos a recorrer por alguien. Y si al final del camino estás tú, entonces cada paso habrá valido la pena»."
};

// PERSONAJES DEL MAPA

const npcs = [
    {
        x: 7,
        y: 10,
        name: "Desconocido",
        dialogues: [
            "Vaya... parece que alguien finalmente ha encontrado el camino hasta aquí.",
            "Hay historias que comienzan mucho antes de que sus protagonistas se conozcan.",
            "Si has llegado hasta esta aldea, quizás sea porque hay alguien que lleva mucho tiempo esperándote."
        ],
        currentDialogue: 0
    },
    {
        x: 12,
        y: 8,
        name: "Viajero",
        dialogues: [
            "¡Espera! No todos los días llega alguien con una mirada tan decidida.",
            "Más allá de esta aldea existe un bosque. Dicen que guarda recuerdos de personas que nunca dejaron de buscarse.",
            "Si realmente buscas descubrir qué te espera, tendrás que comenzar por allí."
        ],
        currentDialogue: 0
    }
];



const forestNPCs = [
    {
        x: 12,
        y: 8,
        name: "Guardiana de los Recuerdos",
        dialogues: [
            "Has llegado al Bosque de los Recuerdos. No todos consiguen encontrar este lugar.",
            "Aquí descansan las historias de quienes, a pesar del tiempo y la distancia, nunca dejaron de recordar.",
            "Hay un recuerdo escondido entre estos árboles. Encuéntralo y quizás comprendas por qué has llegado hasta aquí."
        ],
        currentDialogue: 0,
        postMemoryDialogue: 0,
        postMemoryDialogues: [
            "Así que lo has encontrado... Sabía que tarde o temprano alguien vendría a buscarlo.",
            "Este recuerdo pertenece a alguien que ha recorrido un largo camino, no para encontrar un lugar, sino para encontrar a una persona.",
            "Todavía queda mucho por descubrir. Sigue hacia el mar; allí comprenderás que ninguna distancia es demasiado grande cuando existe un motivo para cruzarla."
        ]
    }
];

const objects = [
    {
        x: 16,
        y: 8,
        name: "Mensaje perdido",
        collected: false,
        message: "A veces, las personas que más buscamos se encuentran al final de los caminos que menos esperamos. No dejes de avanzar."
    },
    {
        x: 23,
        y: 10,
        name: "Flor silvestre",
        collected: false,
        message: "Una pequeña flor que crece junto al camino. Parece esperar a alguien."
    }
];

const forestObjects = [
    {
        x: 22,
        y: 11,
        name: "Recuerdo perdido",
        collected: false,
        message: "Al abrirlo, encuentras unas palabras escritas con cuidado: «Hay personas que llegan a nuestra vida y, sin darse cuenta, hacen que cada pequeño momento se vuelva inolvidable». Sientes que este recuerdo guarda una historia que todavía está esperando su final..."
    }
];

const zones = [
    {
        x: 25,
        y: 10,
        map: "village",
        name: "Entrada al bosque",
        message: "El bosque se extiende ante ti. El camino parece continuar entre los árboles...",
        activated: false
    },
    {
        x: 9,
        y: 0,
        map: "forest",
        name: "Salida hacia el mar",
        message: "El sendero te conduce hacia una costa desconocida...",
        activated: false
    },
    {
        x: 15,
        y: 7,
        map: "sea",
        name: "Salida hacia la montaña",
        message: "Un sendero parece ascender hacia las estrellas...",
        activated: false
    },
    {
        x: 15,
        y: 0,
        map: "mountain",
        name: "Salida hacia el destino",
        message: "Una luz aparece entre las estrellas. El último camino comienza aquí...",
        activated: false
    }
];

const houses = [
    { x: 4, y: 3 },
    { x: 22, y: 4 },
    { x: 23, y: 13 }
];

let gameStarted = false;

// DIBUJAR EL SUELO



function drawGround() {

    for (let y = 0; y < ROWS; y++) {

        for (let x = 0; x < COLS; x++) {

            if (currentMap === "forest") {

                ctx.fillStyle =
                    (x + y) % 2 === 0
                    ? "#456b43"
                    : "#3e633d";

            } else if (currentMap === "sea") {

                // Agua del océano
                // Agua y costa irregular
                const shoreline = 7
                    + Math.sin(x * 0.45) * 1.2
                    + Math.sin(x * 0.9) * 0.5;

                if (y < shoreline - 0.5) {

    // Agua del océano
                ctx.fillStyle =
                (x + y) % 3 === 0
                ? "#3196a8"
                : (x + y) % 3 === 1
                    ? "#3da5b3"
                    : "#368fa5";

            } else if (y < shoreline + 0.5) {

    // Orilla húmeda
                ctx.fillStyle = "#c4ae7e";

            } else {

    // Arena de la playa
                ctx.fillStyle =
                (x + y) % 2 === 0
                    ? "#e4cd91"
                    : "#dcc287";
            }

            } else if (currentMap === "final") {

    // Suelo de mármol violeta
                ctx.fillStyle =
                    (x + y) % 2 === 0
                    ? "#494365"
                    : "#413c5d";

            } else if (currentMap === "mountain") {

    // Límite irregular entre la zona rocosa y la zona verde
                const greenEdgeByRow = [
                    18, 18, 17, 17, 18,
                    19, 18, 17, 17, 16,
                    17, 18, 18, 17, 16,
                    17, 18, 19, 18, 18
                ];

                const greenEdge = greenEdgeByRow[y];

                if (x >= greenEdge) {

        // Suelo verde de la zona de los pinos
                    ctx.fillStyle =
                        (x + y) % 2 === 0
                        ? "#496b53"
                        : "#405f4b";

    } else if (x === greenEdge - 1) {

        // Transición de roca a musgo
        ctx.fillStyle =
            (x + y) % 2 === 0
            ? "#566b68"
            : "#50635f";

    } else {

        // Suelo rocoso de la izquierda
        ctx.fillStyle =
            (x + y) % 2 === 0
            ? "#596477"
            : "#505b70";
    }

            } else {

                // Suelo de la aldea
                ctx.fillStyle =
                    (x + y) % 2 === 0
                    ? "#79aa5c"
                    : "#75a557";

            }

            ctx.fillRect(
                x * TILE,
                y * TILE,
                TILE,
                TILE
            );

            // Pequeños destellos sobre el agua
            if (currentMap === "sea" && y < 7) {

                if ((x * 7 + y * 11) % 9 === 0) {
                    ctx.fillStyle = "rgba(190, 240, 235, 0.45)";
                    ctx.fillRect(
                        x * TILE + 8,
                        y * TILE + 10,
                        9,
                        2
                    );
                }

                if ((x * 13 + y * 5) % 13 === 0) {
                    ctx.fillStyle = "rgba(220, 250, 245, 0.35)";
                    ctx.fillRect(
                        x * TILE + 21,
                        y * TILE + 23,
                        4,
                        2
                    );
                }
            }
            // Conchitas decorativas en la arena
            if (currentMap === "sea" && y >= 9) {

                if ((x * 11 + y * 7) % 19 === 0) {

                    const px = x * TILE;
                    const py = y * TILE;

        // Cuerpo de la conchita
                    ctx.fillStyle = "#f3dfbd";
                    ctx.fillRect(px + 12, py + 16, 9, 5);

        // Parte superior
                    ctx.fillStyle = "#fff0d5";
                    ctx.fillRect(px + 14, py + 13, 5, 4);

        // Pequeño detalle
                    ctx.fillStyle = "#d9b98e";
                    ctx.fillRect(px + 15, py + 17, 2, 3);
                }
            }
            // Pequeños charcos de agua en la arena
            if (currentMap === "sea" && y >= 9) {

                if ((x * 13 + y * 7 + x * y * 2) % 37 === 0) {

                    const px = x * TILE;
                    const py = y * TILE;

        // Sombra del charco
                    ctx.fillStyle = "#8db9b0";
                    ctx.fillRect(px + 5, py + 19, 23, 7);

        // Agua
                    ctx.fillStyle = "#75b9b5";
                    ctx.fillRect(px + 8, py + 17, 17, 8);
                    ctx.fillRect(px + 11, py + 14, 11, 3);

        // Reflejo
                    ctx.fillStyle = "#c5e6d7";
                    ctx.fillRect(px + 11, py + 18, 7, 2);
                    ctx.fillRect(px + 21, py + 21, 3, 2);
                }
            }
            // Estrellas de mar decorativas
            if (currentMap === "sea" && y >= 10) {

                if ((x * 17 + y * 11 + x * y * 3) % 29 === 0) {

                    const px = x * TILE;
                    const py = y * TILE;

        // Centro
                    ctx.fillStyle = "#e88b69";
                    ctx.fillRect(px + 13, py + 13, 7, 7);

        // Brazos
                    ctx.fillRect(px + 15, py + 7, 3, 7);
                    ctx.fillRect(px + 15, py + 19, 3, 7);
                    ctx.fillRect(px + 7, py + 15, 7, 3);
                    ctx.fillRect(px + 19, py + 15, 7, 3);

        // Pequeño detalle
                    ctx.fillStyle = "#f5bd83";
                    ctx.fillRect(px + 15, py + 15, 3, 3);
                }
            }
            // Espuma suave siguiendo las curvas de la costa
            if (currentMap === "sea") {

                const shoreline = 7
                    + Math.sin(x * 0.45) * 1.2
                    + Math.sin(x * 0.9) * 0.5;

                if (Math.abs(y - shoreline) < 0.8) {

                    ctx.fillStyle = "rgba(255, 248, 225, 0.75)";
                    ctx.fillRect(x * TILE + 4, y * TILE + 5, 12, 3);

                    ctx.fillStyle = "rgba(255, 255, 240, 0.6)";
                    ctx.fillRect(x * TILE + 20, y * TILE + 13, 7, 2);
                }
            }
            
            // Detalles naturales del suelo del bosque
            if (currentMap === "forest") {

    // Pequeñas manchas de hierba
                if ((x * 7 + y * 13) % 4 === 0) {

                ctx.fillStyle = "#527c45";

                ctx.fillRect(
                    x * TILE + 5,
                    y * TILE + 7,
                    5,
                    3
                );

                ctx.fillRect(
                    x * TILE + 11,
                    y * TILE + 10,
                    3,
                    3
                );

            }

    // Pequeñas hojas
            if ((x * 11 + y * 5) % 13 === 0) {

                ctx.fillStyle = "#779b55";

                ctx.fillRect(
                    x * TILE + 20,
                    y * TILE + 8,
                    5,
                    3
                );

            }

    // Pequeñas piedritas
            if ((x * 3 + y * 17) % 17 === 0) {

                ctx.fillStyle = "#858b68";

                ctx.fillRect(
                    x * TILE + 22,
                    y * TILE + 23,
                    4,
                    3
                );

            }

        }

            // Pequeños detalles de hierba en la aldea
            if (currentMap === "village") {

                if ((x * 7 + y * 13) % 4 === 0) {

                    ctx.fillStyle = "#638f4d";

                    ctx.fillRect(
                    x * TILE + 7,
                    y * TILE + 9,
                    4,
                    3
                );

                ctx.fillRect(
                    x * TILE + 12,
                    y * TILE + 12,
                    3,
                    3
                );

            }

        }

        }
    }

    // Caminos de la aldea
    if (currentMap === "village") {

        ctx.fillStyle = "#b89a6c";

        ctx.fillRect(
            14 * TILE,
            3 * TILE,
            TILE * 2,
            TILE * 16
        );

        ctx.fillRect(
            2 * TILE,
            9 * TILE,
            TILE * 26,
            TILE * 2
        );

    // Pequeñas piedras y variaciones de tierra
        for (let y = 0; y < ROWS; y++) {

            for (let x = 0; x < COLS; x++) {

                const onPath =
                    (x >= 14 && x <= 15 && y >= 3) ||
                    (y >= 9 && y <= 10 && x >= 2 && x <= 27);

                if (onPath && (x * 11 + y * 7) % 5 === 0) {

                    ctx.fillStyle = "#cbb080";

                    ctx.fillRect(
                        x * TILE + 8,
                        y * TILE + 10,
                        5,
                        3
                    );

                }

            }

        }

    }

    // Caminos del bosque
    else if (currentMap === "forest") {

    // Tierra principal del sendero
        ctx.fillStyle = "#a18a5e";

        ctx.fillRect(
            8 * TILE,
            0,
            TILE * 3,
            TILE * 20
        );

        ctx.fillRect(
            8 * TILE,
            8 * TILE,
            TILE * 12,
            TILE * 2
        );

    // Pequeñas piedras y variaciones de tierra
        for (let y = 0; y < ROWS; y++) {

            for (let x = 0; x < COLS; x++) {

                const onPath =
                    (x >= 8 && x <= 10) ||
                    (y >= 8 && y <= 9 && x >= 8 && x <= 19);

                if (onPath) {

                // Manchas de tierra clara
                    if ((x * 7 + y * 11) % 5 === 0) {

                        ctx.fillStyle = "#bba477";

                        ctx.fillRect(
                            x * TILE + 5,
                            y * TILE + 7,
                            7,
                            4
                        );

                    }

                // Piedritas pequeñas
                if ((x * 13 + y * 3) % 7 === 0) {

                    ctx.fillStyle = "#817552";

                    ctx.fillRect(
                        x * TILE + 20,
                        y * TILE + 19,
                        4,
                        3
                    );

                }

                // Pequeños detalles de tierra oscura
                if ((x * 5 + y * 17) % 9 === 0) {

                    ctx.fillStyle = "#92794e";

                    ctx.fillRect(
                        x * TILE + 14,
                        y * TILE + 13,
                        5,
                        3
                    );

                }

            }

        }

    }

}
// Pequeñas piedras del suelo de la montaña
// Terreno y decoraciones de la montaña
else if (currentMap === "mountain") {

    for (let y = 0; y < ROWS; y++) {

        for (let x = 0; x < COLS; x++) {

            const px = x * TILE;
            const py = y * TILE;

            // Pequeñas piedras
            if ((x * 17 + y * 31 + x * y * 7) % 11 < 3) {

                ctx.fillStyle = "#737f91";
                ctx.fillRect(px + 7, py + 19, 10, 5);

                ctx.fillStyle = "#9aa5b3";
                ctx.fillRect(px + 9, py + 18, 5, 2);

                ctx.fillStyle = "#424e62";
                ctx.fillRect(px + 12, py + 23, 6, 2);
            }

            // Minerales brillantes
            if ((x * 23 + y * 19 + x * y * 3) % 17 === 0) {

                ctx.fillStyle = "#829ac2";
                ctx.fillRect(px + 20, py + 12, 4, 8);

                ctx.fillStyle = "#b8d5ed";
                ctx.fillRect(px + 21, py + 9, 2, 4);

                ctx.fillStyle = "#d9edff";
                ctx.fillRect(px + 21, py + 11, 2, 3);
            }

            // Flores de montaña
            if ((x * 13 + y * 29 + x * y * 5) % 23 === 0) {

                ctx.fillStyle = "#63865c";
                ctx.fillRect(px + 14, py + 19, 2, 7);

                ctx.fillStyle = "#83a96c";
                ctx.fillRect(px + 11, py + 21, 4, 2);
                ctx.fillRect(px + 15, py + 23, 4, 2);

                ctx.fillStyle = "#d6b9ed";
                ctx.fillRect(px + 12, py + 12, 4, 4);
                ctx.fillRect(px + 18, py + 12, 4, 4);
                ctx.fillRect(px + 15, py + 9, 4, 4);
                ctx.fillRect(px + 15, py + 15, 4, 4);

                ctx.fillStyle = "#f6df91";
                ctx.fillRect(px + 16, py + 13, 3, 3);
            }

            // Formaciones rocosas
            if ((x * 19 + y * 11 + x * y * 3) % 31 === 0) {

                ctx.fillStyle = "#3f4a5e";
                ctx.fillRect(px + 5, py + 23, 23, 5);

                ctx.fillStyle = "#626e82";
                ctx.fillRect(px + 7, py + 13, 9, 12);
                ctx.fillRect(px + 10, py + 9, 6, 5);

                ctx.fillStyle = "#758198";
                ctx.fillRect(px + 16, py + 16, 10, 9);
                ctx.fillRect(px + 19, py + 12, 6, 5);

                ctx.fillStyle = "#a1adbd";
                ctx.fillRect(px + 10, py + 11, 4, 3);
                ctx.fillRect(px + 19, py + 14, 3, 3);
            }

            // Arbustos de montaña
            if ((x * 11 + y * 23 + x * y * 5) % 27 === 0) {

                ctx.fillStyle = "#354d4b";
                ctx.fillRect(px + 7, py + 24, 18, 4);

                ctx.fillStyle = "#587c68";
                ctx.fillRect(px + 9, py + 17, 13, 8);
                ctx.fillRect(px + 6, py + 20, 7, 5);
                ctx.fillRect(px + 17, py + 19, 9, 6);

                ctx.fillStyle = "#83a27c";
                ctx.fillRect(px + 11, py + 16, 6, 4);
                ctx.fillRect(px + 19, py + 18, 4, 3);
            }

            // Destellos mágicos
            if ((x * 29 + y * 17 + x * y * 7) % 37 === 0) {

                ctx.fillStyle = "rgba(91, 157, 220, 0.25)";
                ctx.fillRect(px + 10, py + 9, 13, 13);

                ctx.fillStyle = "#72b9e8";
                ctx.fillRect(px + 15, py + 12, 4, 7);

                ctx.fillStyle = "#d5f2ff";
                ctx.fillRect(px + 16, py + 10, 2, 3);

                ctx.fillStyle = "#b5e6ff";
                ctx.fillRect(px + 10, py + 14, 2, 2);
                ctx.fillRect(px + 22, py + 10, 2, 2);
            }

            // Parches de nieve
            if ((x * 31 + y * 13 + x * y * 5) % 41 === 0) {

                ctx.fillStyle = "#8799ad";
                ctx.fillRect(px + 5, py + 22, 19, 5);

                ctx.fillStyle = "#c4d6e5";
                ctx.fillRect(px + 7, py + 18, 16, 5);
                ctx.fillRect(px + 10, py + 15, 10, 4);

                ctx.fillStyle = "#edf7ff";
                ctx.fillRect(px + 11, py + 16, 7, 2);
            }
        }
    }
}

// Sendero rocoso de la montaña
else if (currentMap === "mountain") {

    ctx.fillStyle = "#887f78";

    // Primer tramo
    ctx.fillRect(
        13 * TILE,
        12 * TILE,
        TILE * 4,
        TILE * 8
    );

    // Curva hacia la izquierda
    ctx.fillRect(
        8 * TILE,
        11 * TILE,
        TILE * 9,
        TILE * 3
    );

    // Segundo tramo
    ctx.fillRect(
        8 * TILE,
        5 * TILE,
        TILE * 3,
        TILE * 8
    );

    // Curva hacia la derecha
    ctx.fillRect(
        8 * TILE,
        5 * TILE,
        TILE * 13,
        TILE * 3
    );

    // Último tramo
    ctx.fillRect(
        18 * TILE,
        0,
        TILE * 3,
        TILE * 7
    );
}
// Detalles del mármol del castillo
if (currentMap === "final") {

    for (let y = 1; y < ROWS; y += 3) {
        for (let x = 1; x < COLS; x += 4) {

            const px = x * TILE;
            const py = y * TILE;

            ctx.fillStyle = "#625b7d";
            ctx.fillRect(px + 8, py + 10, 7, 2);
            ctx.fillRect(px + 12, py + 12, 2, 5);

            ctx.fillStyle = "#77708f";
            ctx.fillRect(px + 18, py + 21, 5, 2);
        }
    }
}

// Corazones decorativos del mármol
if (currentMap === "final") {

    const floorHearts = [
        { x: 3, y: 4, size: 1 },
        { x: 7, y: 2, size: 2 },
        { x: 24, y: 3, size: 1 },
        { x: 27, y: 6, size: 2 },
        { x: 4, y: 10, size: 2 },
        { x: 7, y: 12, size: 1 },
        { x: 24, y: 10, size: 1 },
        { x: 27, y: 14, size: 2 },
        { x: 3, y: 17, size: 1 },
        { x: 25, y: 18, size: 2 }
    ];

    for (let i = 0; i < floorHearts.length; i++) {

        const heart = floorHearts[i];

        const x = heart.x * TILE;
        const y = heart.y * TILE;
        const s = heart.size === 2 ? 1.5 : 1;

        // Alternar tonos rosados
        ctx.fillStyle = i % 2 === 0
            ? "#d99abf"
            : "#b99bd8";

        // Parte superior del corazón
        ctx.fillRect(x + 8 * s, y + 8 * s, 6 * s, 6 * s);
        ctx.fillRect(x + 18 * s, y + 8 * s, 6 * s, 6 * s);

        // Centro
        ctx.fillRect(x + 5 * s, y + 13 * s, 22 * s, 6 * s);

        // Parte inferior
        ctx.fillRect(x + 8 * s, y + 19 * s, 16 * s, 4 * s);
        ctx.fillRect(x + 11 * s, y + 23 * s, 10 * s, 4 * s);
        ctx.fillRect(x + 14 * s, y + 27 * s, 4 * s, 4 * s);

        // Pequeño brillo
        ctx.fillStyle = "#f5d5e7";
        ctx.fillRect(x + 10 * s, y + 10 * s, 3 * s, 3 * s);
    }
}

// Camino principal del castillo
if (currentMap === "final") {

    // Base de la alfombra
    ctx.fillStyle = "#77749b";

    ctx.fillRect(
        13 * TILE,
        0,
        TILE * 4,
        TILE * 20
    );

    // Zona amplia del encuentro
    ctx.fillRect(
        8 * TILE,
        3 * TILE,
        TILE * 14,
        TILE * 5
    );

    // Detalles interiores de la alfombra
    for (let y = 0; y < ROWS; y += 2) {

        // Patrón del camino vertical
        for (let x = 13; x < 17; x++) {

            const px = x * TILE;
            const py = y * TILE;

            ctx.fillStyle =
                (x + y) % 2 === 0
                ? "#827da5"
                : "#6b668f";

            ctx.fillRect(
                px + 5,
                py + 5,
                22,
                22
            );
        }
    }

    // Patrón de la zona del encuentro
    for (let y = 3; y < 8; y++) {
        for (let x = 8; x < 22; x++) {

            const px = x * TILE;
            const py = y * TILE;

            ctx.fillStyle =
                (x + y) % 2 === 0
                ? "#827da5"
                : "#6b668f";

            ctx.fillRect(
                px + 5,
                py + 5,
                22,
                22
            );
        }
    }


}
    // Rayos de luz del Bosque de los Recuerdos
    if (currentMap === "forest") {

        ctx.save();

        ctx.globalAlpha = 0.09;
        ctx.fillStyle = "#fff1b8";

    // Primer rayo de luz
        ctx.beginPath();
        ctx.moveTo(4 * TILE, 0);
        ctx.lineTo(6 * TILE, 0);
        ctx.lineTo(10 * TILE, 13 * TILE);
        ctx.lineTo(7 * TILE, 13 * TILE);
        ctx.closePath();
        ctx.fill();

    // Segundo rayo de luz
        ctx.beginPath();
        ctx.moveTo(14 * TILE, 0);
        ctx.lineTo(16 * TILE, 0);
        ctx.lineTo(20 * TILE, 10 * TILE);
        ctx.lineTo(17 * TILE, 10 * TILE);
        ctx.closePath();
        ctx.fill();

    // Tercer rayo de luz
        ctx.beginPath();
        ctx.moveTo(24 * TILE, 0);
        ctx.lineTo(26 * TILE, 0);
        ctx.lineTo(23 * TILE, 12 * TILE);
        ctx.lineTo(21 * TILE, 12 * TILE);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
    
    // Pequeñas piedras del sendero
    if (currentMap === "mountain") {

        for (let y = 0; y < ROWS; y++) {

            for (let x = 0; x < COLS; x++) {

                const onPath =
                    (x >= 13 && x <= 16 && y >= 12) ||
                    (y >= 11 && y <= 13 && x >= 8 && x <= 16) ||
                    (x >= 8 && x <= 10 && y >= 5 && y <= 13) ||
                    (y >= 5 && y <= 7 && x >= 8 && x <= 20) ||
                    (x >= 18 && x <= 20 && y <= 6);

                if (onPath && (x * 13 + y * 7) % 4 === 0) {

                    ctx.fillStyle = "#a99e91";
                    ctx.fillRect(
                        x * TILE + 7,
                        y * TILE + 12,
                        6,
                        3
                    );

                    ctx.fillStyle = "#716d6b";
                    ctx.fillRect(
                        x * TILE + 19,
                        y * TILE + 23,
                        4,
                        2
                    );
                }
            }
        }
    }

}




// DIBUJAR ÁRBOLES

function drawTrees() {

    const activeTrees = currentMap === "forest"
        ? forestTrees
        : currentMap === "village"
            ? trees
            : [];
            // Columnas del salón del castillo
            if (currentMap === "final") {

                const castleColumns = [
                    { x: 12, y: 1 },
                    { x: 11, y: 7 },
                    { x: 12, y: 13 },
                    { x: 17, y: 1 },
                    { x: 18, y: 7 },
                    { x: 17, y: 13 }
                ];

                for (const column of castleColumns) {

                    const x = column.x * TILE;
                    const y = column.y * TILE;

        // Sombra
                    ctx.fillStyle = "rgba(15, 12, 35, 0.3)";
                    ctx.fillRect(x + 3, y + 27, 27, 6);

        // Base de piedra
                    ctx.fillStyle = "#77718f";
                    ctx.fillRect(x + 5, y + 24, 23, 7);

        // Cuerpo de la columna
                    ctx.fillStyle = "#aaa2c4";
                    ctx.fillRect(x + 9, y + 5, 15, 21);

        // Iluminación lateral
                    ctx.fillStyle = "#d5c9e9";
                    ctx.fillRect(x + 10, y + 7, 4, 17);

        // Sombra lateral
                    ctx.fillStyle = "#77708f";
                    ctx.fillRect(x + 21, y + 7, 3, 17);

        // Capitel superior
                    ctx.fillStyle = "#c7bbdf";
                    ctx.fillRect(x + 5, y + 2, 23, 5);

        // Detalle violeta
                    ctx.fillStyle = "#8175a9";
                    ctx.fillRect(x + 13, y + 3, 7, 3);
                }
            }
            // Candelabros del salón del castillo
            if (currentMap === "final") {

                const castleCandles = [
                    { x: 11, y: 6 },
                    { x: 12, y: 12 },
                    { x: 18, y: 6 },
                    { x: 17, y: 12 },
                    { x: 17, y: 0 },
                    { x: 12, y: 0 }
                ];

                const time = Date.now() / 300;

                for (let i = 0; i < castleCandles.length; i++) {

                    const candle = castleCandles[i];

                    const x = candle.x * TILE;
                    const y = candle.y * TILE;

                    const glow = (Math.sin(time + i) + 1) / 2;

                    ctx.save();

        // Resplandor
                    ctx.globalAlpha = 0.12 + glow * 0.12;
                    ctx.fillStyle = "#ffd78a";
                    ctx.fillRect(x + 2, y + 2, 28, 28);

                    ctx.globalAlpha = 1;

        // Base
                    ctx.fillStyle = "#76618c";
                    ctx.fillRect(x + 7, y + 19, 18, 9);

        // Estructura dorada
                    ctx.fillStyle = "#b58a50";
                    ctx.fillRect(x + 11, y + 8, 10, 13);

        // Centro
                    ctx.fillStyle = "#e0b96f";
                    ctx.fillRect(x + 13, y + 10, 6, 9);

        // Llama
                    ctx.fillStyle = "#ffb347";
                    ctx.fillRect(x + 14, y + 4, 4, 7);

        // Centro luminoso
                    ctx.fillStyle = "#fff0ad";
                    ctx.fillRect(x + 15, y + 5, 2, 4);

                    ctx.restore();
                }
            }
            // Maceteros ornamentales del castillo
            if (currentMap === "final") {

                const castlePlants = [
                    { x: 2, y: 2 },
                    { x: 26, y: 2 },
                    { x: 2, y: 16 },
                    { x: 26, y: 16 }
                ];

                for (const plant of castlePlants) {

                    const x = plant.x * TILE;
                    const y = plant.y * TILE;

        // Sombra
                    ctx.fillStyle = "rgba(15, 12, 35, 0.3)";
                    ctx.fillRect(x + 5, y + 25, 23, 5);

        // Macetero
                    ctx.fillStyle = "#77618f";
                    ctx.fillRect(x + 6, y + 14, 20, 13);

        // Borde superior
                    ctx.fillStyle = "#b49acb";
                    ctx.fillRect(x + 4, y + 12, 24, 5);

        // Tierra
                    ctx.fillStyle = "#493b50";
                    ctx.fillRect(x + 9, y + 15, 14, 3);

                    // Hojas
                    ctx.fillStyle = "#477b55";
                    ctx.fillRect(x + 13, y + 4, 7, 10);
                    ctx.fillRect(x + 6, y + 7, 9, 6);
                    ctx.fillRect(x + 18, y + 6, 9, 7);

                    // Detalles de las hojas
                    ctx.fillStyle = "#76a66c";
                    ctx.fillRect(x + 15, y + 3, 3, 6);
                    ctx.fillRect(x + 8, y + 8, 4, 3);
                    ctx.fillRect(x + 21, y + 7, 4, 3);
                }
            }
            // Plataforma ceremonial en la entrada del castillo
            if (currentMap === "final") {

                // Sombra
                ctx.fillStyle = "rgba(15, 12, 35, 0.3)";
                ctx.fillRect(
                    11 * TILE,
                    16 * TILE + 5,
                    8 * TILE,
                    3 * TILE
                );

                // Escalón inferior
                ctx.fillStyle = "#625b7d";
                ctx.fillRect(
                    11 * TILE,
                    16 * TILE,
                    8 * TILE,
                    3 * TILE
                );

                // Escalón superior
                ctx.fillStyle = "#9185ad";
                ctx.fillRect(
                    12 * TILE,
                    16 * TILE + 5,
                    6 * TILE,
                    2 * TILE
                );

                // Superficie central
                ctx.fillStyle = "#b2a5c9";
                ctx.fillRect(
                    13 * TILE,
                    16 * TILE + 9,
                    4 * TILE,
                    TILE + 3
                );

                // Detalle ornamental
                ctx.fillStyle = "#d8c6ed";
                ctx.fillRect(
                    14 * TILE,
                    16 * TILE + 12,
                    2 * TILE,
                    3
                );
            }
            // Emblema real del castillo
            if (currentMap === "final") {

                const centerX = 15 * TILE;
                const centerY = 12 * TILE;

                // Sombra exterior
                ctx.fillStyle = "#302b49";
                ctx.fillRect(centerX - 29, centerY - 21, 58, 42);

                // Diamante exterior
                ctx.fillStyle = "#a994c7";
                ctx.fillRect(centerX - 24, centerY - 17, 48, 34);

                // Centro violeta
                ctx.fillStyle = "#62547f";
                ctx.fillRect(centerX - 19, centerY - 13, 38, 26);

                // Detalle central dorado
                ctx.fillStyle = "#d5b477";
                ctx.fillRect(centerX - 3, centerY - 9, 6, 18);
                ctx.fillRect(centerX - 9, centerY - 3, 18, 6);

                // Brillo central
                ctx.fillStyle = "#f1d9a5";
                ctx.fillRect(centerX - 2, centerY - 5, 4, 10);
            }
            // Cristales mágicos del salón
            if (currentMap === "final") {

                const magicCrystals = [
                    { x: 8, y: 3 },
                    { x: 8, y: 7 },
                    { x: 21, y: 7 },
                    { x: 21, y: 3 }
                ];

                const glow = (Math.sin(Date.now() / 350) + 1) / 2;

                for (const crystal of magicCrystals) {

                    const x = crystal.x * TILE;
                    const y = crystal.y * TILE;

                    // Resplandor
                    ctx.globalAlpha = 0.15 + glow * 0.2;
                    ctx.fillStyle = "#c9a5ff";
                    ctx.fillRect(x, y, TILE, TILE);

                    ctx.globalAlpha = 1;

                    // Sombra
                    ctx.fillStyle = "#45365f";
                    ctx.fillRect(x + 10, y + 21, 13, 5);

                    // Cuerpo del cristal
                    ctx.fillStyle = "#9876c9";
                    ctx.fillRect(x + 12, y + 7, 9, 16);

                    // Punta superior
                    ctx.fillStyle = "#c9aaff";
                    ctx.fillRect(x + 14, y + 3, 5, 6);

                    // Brillo
                    ctx.fillStyle = "#eee0ff";
                    ctx.fillRect(x + 14, y + 9, 3, 8);
                }
            }

            // Lámparas ornamentales del castillo
            if (currentMap === "final") {

                const castleLamps = [
                    { x: 5, y: 6 },
                    { x: 24, y: 6 },
                    { x: 5, y: 12 },
                    { x: 24, y: 12 }
                ];

                const glow = (Math.sin(Date.now() / 400) + 1) / 2;

                for (const lamp of castleLamps) {

                    const x = lamp.x * TILE;
                    const y = lamp.y * TILE;

                    // Resplandor
                    ctx.globalAlpha = 0.12 + glow * 0.12;
                    ctx.fillStyle = "#d7b9ff";
                    ctx.fillRect(x, y, TILE, TILE);

                    ctx.globalAlpha = 1;

                    // Base
                    ctx.fillStyle = "#65547f";
                    ctx.fillRect(x + 6, y + 20, 20, 7);

                    // Estructura
                    ctx.fillStyle = "#a18abf";
                    ctx.fillRect(x + 10, y + 10, 12, 12);

                    // Cristal luminoso
                    ctx.fillStyle = "#c9aaff";
                    ctx.fillRect(x + 12, y + 5, 8, 12);

                    // Brillo interior
                    ctx.fillStyle = "#f1e4ff";
                    ctx.fillRect(x + 14, y + 7, 3, 7);
                }
            }

            // Detalles dorados de la alfombra
            if (currentMap === "final") {

                for (let y = 1; y < ROWS; y += 3) {

                    const leftX = 13 * TILE;
                    const rightX = 16 * TILE;
                    const py = y * TILE;

                    // Detalle izquierdo
                    ctx.fillStyle = "#c9ad78";
                    ctx.fillRect(leftX + 5, py + 13, 5, 5);

                    // Brillo izquierdo
                    ctx.fillStyle = "#ead6a8";
                    ctx.fillRect(leftX + 6, py + 14, 2, 2);

                    // Detalle derecho
                    ctx.fillStyle = "#c9ad78";
                    ctx.fillRect(rightX + 22, py + 13, 5, 5);

                    // Brillo derecho
                    ctx.fillStyle = "#ead6a8";
                    ctx.fillRect(rightX + 23, py + 14, 2, 2);
                }
            }

            // Mosaico de la entrada del castillo
            if (currentMap === "final") {

                const centerX = 15 * TILE;
                const centerY = 17 * TILE;

                // Base del mosaico
                ctx.fillStyle = "#554a70";
                ctx.fillRect(centerX - 38, centerY - 12, 76, 24);

                // Interior
                ctx.fillStyle = "#8d7ba9";
                ctx.fillRect(centerX - 32, centerY - 8, 64, 16);

                // Líneas doradas
                ctx.fillStyle = "#c9ad78";
                ctx.fillRect(centerX - 25, centerY - 2, 50, 3);
                ctx.fillRect(centerX - 2, centerY - 7, 4, 14);

                // Diamantes laterales
                ctx.fillStyle = "#e5d1a5";
                ctx.fillRect(centerX - 29, centerY - 3, 6, 6);
                ctx.fillRect(centerX + 23, centerY - 3, 6, 6);

                // Centro luminoso
                ctx.fillStyle = "#d8c6ed";
                ctx.fillRect(centerX - 5, centerY - 5, 10, 10);
            }

            // Estrellas decorativas del mármol
            if (currentMap === "final") {

                const floorStars = [
                    { x: 4, y: 5 },
                    { x: 7, y: 15 },
                    { x: 24, y: 4 },
                    { x: 26, y: 14 },
                    { x: 3, y: 10 },
                    { x: 27, y: 8 },
                    { x: 11, y: 3 },
                    { x: 18, y: 16 }
                ];

                for (let i = 0; i < floorStars.length; i++) {

                    const star = floorStars[i];

                    const x = star.x * TILE;
                    const y = star.y * TILE;

                    const size = i % 2 === 0 ? 5 : 3;

                    // Brillo
                    ctx.fillStyle = "#b9a5d9";
                    ctx.fillRect(
                        x + 14 - size,
                        y + 14 - size,
                        size * 2,
                        size * 2
                    );

                    // Centro luminoso
                    ctx.fillStyle = "#e5d8fa";
                    ctx.fillRect(
                        x + 14,
                        y + 14,
                        3,
                        3
                    );
                }
            }

            // Estatuas guardianas del castillo
            if (currentMap === "final") {

                const castleGuardians = [
                    { x: 7, y: 16 },
                    { x: 22, y: 16 }
                ];

                for (const guardian of castleGuardians) {

                    const x = guardian.x * TILE;
                    const y = guardian.y * TILE;

                    // Sombra
                    ctx.fillStyle = "rgba(15, 12, 35, 0.35)";
                    ctx.fillRect(x + 4, y + 25, 25, 5);

                    // Base de mármol
                    ctx.fillStyle = "#77708f";
                    ctx.fillRect(x + 3, y + 20, 27, 9);

                    // Borde de la base
                    ctx.fillStyle = "#c7bbdf";
                    ctx.fillRect(x + 5, y + 20, 23, 3);

                    // Cuerpo de la estatua
                    ctx.fillStyle = "#aaa2c4";
                    ctx.fillRect(x + 8, y + 8, 17, 14);

                    // Cabeza
                    ctx.fillStyle = "#d5c9e9";
                    ctx.fillRect(x + 10, y + 4, 13, 9);

                    // Detalles laterales
                    ctx.fillStyle = "#8175a9";
                    ctx.fillRect(x + 5, y + 10, 5, 9);
                    ctx.fillRect(x + 22, y + 10, 5, 9);

                    // Corona
                    ctx.fillStyle = "#c9ad78";
                    ctx.fillRect(x + 11, y + 2, 11, 4);

                    // Brillo de la corona
                    ctx.fillStyle = "#f1d9a5";
                    ctx.fillRect(x + 15, y + 2, 3, 2);
                }
            }

            // Vitrinas reales del castillo
            if (currentMap === "final") {

                const castleShowcases = [
                    { x: 4, y: 14, type: "crown" },
                    { x: 23, y: 14, type: "star" }
                ];

                for (const showcase of castleShowcases) {

                    const x = showcase.x * TILE;
                    const y = showcase.y * TILE;

                    // Sombra
                    ctx.fillStyle = "rgba(15, 12, 35, 0.3)";
                    ctx.fillRect(x + 4, y + 24, 26, 6);

                    // Base de madera oscura
                    ctx.fillStyle = "#51416f";
                    ctx.fillRect(x + 3, y + 5, 26, 22);

                    // Marco dorado
                    ctx.fillStyle = "#c9ad78";
                    ctx.fillRect(x + 5, y + 7, 22, 18);

                    // Cristal de la vitrina
                    ctx.fillStyle = "#8b83b5";
                    ctx.fillRect(x + 8, y + 10, 16, 12);

                    // Reflejo del cristal
                    ctx.fillStyle = "#c7c9e8";
                    ctx.fillRect(x + 10, y + 11, 3, 7);

                    if (showcase.type === "crown") {

                        // Corona antigua
                        ctx.fillStyle = "#e2bd72";
                        ctx.fillRect(x + 12, y + 14, 10, 5);
                        ctx.fillRect(x + 12, y + 11, 3, 5);
                        ctx.fillRect(x + 15, y + 9, 3, 7);
                        ctx.fillRect(x + 18, y + 11, 3, 5);

                    } else {

                        // Estrella antigua
                        ctx.fillStyle = "#f1d9a5";
                        ctx.fillRect(x + 15, y + 10, 4, 12);
                        ctx.fillRect(x + 11, y + 14, 12, 4);
                        ctx.fillRect(x + 13, y + 12, 8, 8);
                    }
                }
            }

    activeTrees.forEach(([x, y], index) => {

        const px = x * TILE;
        const py = y * TILE;

    // Cada árbol tendrá un tamaño diferente
        const size = currentMap === "forest"
            ? [1.2, 1.3, 1.15, 1.35, 1.25][index % 5]
            : [0.85, 1, 1.15, 1.25, 0.95][index % 5];

        ctx.save();

    // Ajustar tamaño sin cambiar la posición del árbol
        ctx.translate(px + TILE / 2, py + TILE);
        ctx.scale(size, size);
        ctx.translate(-TILE / 2, -TILE);

    // Sombra
        ctx.fillStyle = "rgba(25, 45, 28, 0.25)";
        ctx.fillRect(5, 23, 23, 7);

    // Tronco
        ctx.fillStyle = "#795337";
        ctx.fillRect(12, 17, 9, 15);

        ctx.fillStyle = "#a4774d";
        ctx.fillRect(14, 19, 3, 10);

    // Silueta de las hojas
        ctx.fillStyle = "#294f35";
        ctx.fillRect(5, 8, 22, 17);
        ctx.fillRect(9, 3, 14, 23);
        ctx.fillRect(3, 12, 26, 10);

    // Variaciones de color
        const villageGreens = [
            ["#3f7544", "#609650", "#83ad61"],
            ["#356b42", "#548b4d", "#79a95b"],
            ["#477d43", "#6a9d51", "#91b86b"],
            ["#326642", "#4e8950", "#75a65e"],
            ["#416f3c", "#63924a", "#87ad60"]
        ];

        const forestGreens = [
            ["#234b35", "#39734a", "#68a36a"],
            ["#28543b", "#447e4e", "#78ad70"],
            ["#1e4534", "#356b48", "#5f9662"],
            ["#315b3d", "#4b8552", "#83b477"],
            ["#244832", "#3e7545", "#70a66b"]
        ];

const colors = currentMap === "forest"
    ? forestGreens[index % forestGreens.length]
    : villageGreens[index % villageGreens.length];

    // Hojas principales
        ctx.fillStyle = colors[0];
        ctx.fillRect(7, 7, 18, 16);
        ctx.fillRect(10, 3, 13, 19);
        ctx.fillRect(4, 11, 24, 10);

    // Hojas iluminadas
        ctx.fillStyle = colors[1];
        ctx.fillRect(9, 5, 10, 7);
        ctx.fillRect(5, 12, 7, 5);
        ctx.fillRect(17, 11, 8, 6);

    // Brillos
        ctx.fillStyle = colors[2];
        ctx.fillRect(11, 6, 4, 3);
        ctx.fillRect(19, 9, 3, 3);

        ctx.restore();

    });

        // Arbustos decorativos de la aldea
    if (currentMap === "village") {

        const bushes = [
            { x: 1, y: 7 },
            { x: 7, y: 7 },
            { x: 12, y: 5 },
            { x: 17, y: 7 },
            { x: 28, y: 13 },
            { x: 7, y: 16 },
            { x: 24, y: 18 }
        ];

        for (const bush of bushes) {

            const x = bush.x * TILE;
            const y = bush.y * TILE;

            // Sombra
            ctx.fillStyle = "#315c38";
            ctx.fillRect(x + 5, y + 19, 23, 8);

            // Cuerpo del arbusto
            ctx.fillStyle = "#477e45";
            ctx.fillRect(x + 5, y + 10, 22, 13);

            // Parte superior
            ctx.fillStyle = "#60964e";
            ctx.fillRect(x + 9, y + 5, 14, 12);

            // Detalles de luz
            ctx.fillStyle = "#80aa5d";
            ctx.fillRect(x + 10, y + 8, 5, 4);

        }

    }

    // Arbustos decorativos del bosque
    if (currentMap === "forest") {

        const forestBushes = [
            { x: 4, y: 4 },
            { x: 18, y: 4 },
            { x: 25, y: 4 },
            { x: 2, y: 7 },
            { x: 8, y: 7 },
            { x: 17, y: 7 },
            { x: 26, y: 8 },
            { x: 4, y: 11 },
            { x: 11, y: 11 },
            { x: 19, y: 11 },
            { x: 27, y: 11 },
            { x: 2, y: 14 },
            { x: 16, y: 14 },
            { x: 24, y: 14 },
            { x: 5, y: 17 },
            { x: 13, y: 17 },
            { x: 20, y: 17 },
            { x: 27, y: 17 }
        ];

        for (const bush of forestBushes) {

            const x = bush.x * TILE;
            const y = bush.y * TILE;

        // Sombra
            ctx.fillStyle = "#244b32";
            ctx.fillRect(x + 5, y + 19, 23, 8);

        // Cuerpo del arbusto
            ctx.fillStyle = "#356b40";
            ctx.fillRect(x + 5, y + 10, 22, 13);

        // Parte superior
            ctx.fillStyle = "#477e4b";
            ctx.fillRect(x + 9, y + 5, 14, 12);

        // Detalles de luz
            ctx.fillStyle = "#6b9e5d";
            ctx.fillRect(x + 10, y + 8, 5, 4);
        }
    }
    // Piedras y troncos caídos del bosque
    if (currentMap === "forest") {

        const forestRocks = [
            { x: 1, y: 4 },
            { x: 6, y: 4 },
            { x: 13, y: 5 },
            { x: 23, y: 5 },
            { x: 2, y: 13 },
            { x: 11, y: 13 },
            { x: 19, y: 14 },
            { x: 26, y: 17 }
        ];

        const fallenLogs = [
            { x: 5, y: 4 },
            { x: 17, y: 5 },
            { x: 3, y: 10 },
            { x: 23, y: 10 },
            { x: 14, y: 16 }
        ];

    // Piedras con musgo
        for (const rock of forestRocks) {

            const x = rock.x * TILE;
            const y = rock.y * TILE;

        // Sombra
            ctx.fillStyle = "#294b35";
            ctx.fillRect(x + 5, y + 23, 23, 6);

        // Cuerpo de la piedra
            ctx.fillStyle = "#777e70";
            ctx.fillRect(x + 7, y + 13, 19, 12);

            ctx.fillStyle = "#a0a18a";
            ctx.fillRect(x + 11, y + 9, 12, 8);

        // Musgo
            ctx.fillStyle = "#638e50";
            ctx.fillRect(x + 9, y + 12, 7, 3);
            ctx.fillRect(x + 19, y + 17, 5, 3);
        }

    // Troncos caídos
        for (const log of fallenLogs) {

            const x = log.x * TILE;
            const y = log.y * TILE;

        // Sombra
            ctx.fillStyle = "#29452f";
            ctx.fillRect(x + 3, y + 23, 27, 5);

        // Tronco
            ctx.fillStyle = "#704b32";
            ctx.fillRect(x + 4, y + 13, 25, 9);

        // Parte iluminada
            ctx.fillStyle = "#986b43";
            ctx.fillRect(x + 6, y + 14, 21, 3);

        // Extremo del tronco
            ctx.fillStyle = "#c49a69";
            ctx.fillRect(x + 25, y + 14, 5, 7);

        // Musgo sobre el tronco
            ctx.fillStyle = "#527d43";
            ctx.fillRect(x + 10, y + 11, 8, 3);
            ctx.fillRect(x + 19, y + 12, 5, 2);
        }
    }
        // Elementos decorativos de la playa
    if (currentMap === "sea") {

        for (const object of seaObjects) {

            const x = object.x * TILE;
            const y = object.y * TILE;

            if (object.type === "rock") {

                // Rocas
                ctx.fillStyle = "#777b78";
                ctx.fillRect(x + 7, y + 14, 19, 12);

                ctx.fillStyle = "#a5aaa3";
                ctx.fillRect(x + 11, y + 10, 12, 8);

            } else if (object.type === "palm") {

    // Sombra de la palmera
                ctx.fillStyle = "rgba(35, 45, 30, 0.25)";
                ctx.fillRect(x + 4, y + 27, 25, 5);

    // Tronco curvado
                ctx.fillStyle = "#795337";
                ctx.fillRect(x + 14, y + 10, 6, 20);
                ctx.fillRect(x + 12, y + 15, 3, 12);
                ctx.fillRect(x + 17, y + 20, 3, 10);

    // Detalles del tronco
                ctx.fillStyle = "#a77a4c";
                ctx.fillRect(x + 15, y + 14, 4, 2);
                ctx.fillRect(x + 14, y + 21, 5, 2);

    // Hojas oscuras
                ctx.fillStyle = "#245b39";
                ctx.fillRect(x + 1, y + 5, 13, 6);
                ctx.fillRect(x + 18, y + 4, 13, 6);
                ctx.fillRect(x + 5, y - 1, 7, 13);
                ctx.fillRect(x + 20, y + 7, 10, 7);

    // Hojas principales
                ctx.fillStyle = "#367b48";
                ctx.fillRect(x + 2, y + 3, 14, 5);
                ctx.fillRect(x + 17, y + 2, 14, 5);
                ctx.fillRect(x + 5, y - 2, 6, 13);
                ctx.fillRect(x + 20, y + 6, 9, 7);

    // Hojas claras
                ctx.fillStyle = "#72a957";
                ctx.fillRect(x + 4, y + 4, 9, 2);
                ctx.fillRect(x + 19, y + 3, 9, 2);
                ctx.fillRect(x + 7, y, 3, 6);

    // Cocos
                ctx.fillStyle = "#8b633d";
                ctx.fillRect(x + 13, y + 7, 4, 4);
                ctx.fillRect(x + 18, y + 8, 4, 4);
                ctx.fillRect(x + 16, y + 4, 4, 4);

    // Brillo de los cocos
                ctx.fillStyle = "#c09258";
                ctx.fillRect(x + 14, y + 8, 2, 2);
            }

        }
        // Corales y plantas marinas
        const seaCorals = [
            { x: 2, y: 3, color: "#e8899b" },
            { x: 10, y: 5, color: "#e9a05f" },
            { x: 17, y: 2, color: "#b78bd1" },
            { x: 25, y: 4, color: "#e8899b" },
            { x: 8, y: 6, color: "#b78bd1" },
            { x: 22, y: 5, color: "#e9a05f" }
        ];

        for (const coral of seaCorals) {

            const cx = coral.x * TILE;
            const cy = coral.y * TILE;

    // Base del coral
            ctx.fillStyle = "#326d70";
            ctx.fillRect(cx + 10, cy + 20, 13, 5);

    // Ramas
            ctx.fillStyle = coral.color;
            ctx.fillRect(cx + 14, cy + 10, 4, 13);
            ctx.fillRect(cx + 7, cy + 13, 4, 9);
            ctx.fillRect(cx + 21, cy + 12, 4, 10);

    // Puntas
            ctx.fillRect(cx + 11, cy + 8, 4, 4);
            ctx.fillRect(cx + 4, cy + 10, 4, 4);
            ctx.fillRect(cx + 21, cy + 8, 4, 4);

    // Brillos
            ctx.fillStyle = "#f8c4c7";
            ctx.fillRect(cx + 15, cy + 12, 2, 4);
        }

// Plantas marinas
        const seaPlants = [
            { x: 5, y: 5 },
            { x: 14, y: 3 },
            { x: 27, y: 2 },
            { x: 19, y: 6 }
        ];

        for (const plant of seaPlants) {

            const px = plant.x * TILE;
            const py = plant.y * TILE;

            ctx.fillStyle = "#4d9b79";

            ctx.fillRect(px + 13, py + 13, 3, 12);
            ctx.fillRect(px + 8, py + 8, 4, 12);
            ctx.fillRect(px + 18, py + 6, 4, 15);

            ctx.fillStyle = "#83c99a";
            ctx.fillRect(px + 9, py + 9, 2, 5);
            ctx.fillRect(px + 19, py + 7, 2, 6);
        }

    }
    // Rocas de la montaña
    if (currentMap === "mountain") {

        for (const rock of mountainObjects) {

            const x = rock.x * TILE;
            const y = rock.y * TILE;

        // Sombra
            ctx.fillStyle = "#50545b";
            ctx.fillRect(x + 5, y + 19, 23, 9);

        // Cuerpo de la roca
            ctx.fillStyle = "#92979e";
            ctx.fillRect(x + 7, y + 10, 19, 16);

        // Parte superior
            ctx.fillStyle = "#b5bac0";
            ctx.fillRect(x + 11, y + 6, 12, 10);

        // Detalle oscuro
            ctx.fillStyle = "#777d85";
            ctx.fillRect(x + 10, y + 15, 5, 5);

        }

    }

        // Cristales mágicos de la montaña
    if (currentMap === "mountain") {

        const iceCrystals = [
            { x: 5, y: 8 },
            { x: 10, y: 14 },
            { x: 22, y: 9 },
            { x: 26, y: 15 },
            { x: 16, y: 4 },
            { x: 3, y: 17 }
        ];

        const time = Date.now() / 700;

        for (let i = 0; i < iceCrystals.length; i++) {

            const crystal = iceCrystals[i];

            const x = crystal.x * TILE;
            const y = crystal.y * TILE;

            const glow = (Math.sin(time + i) + 1) / 2;

            ctx.save();

        // Resplandor
            ctx.globalAlpha = 0.15 + glow * 0.2;
            ctx.fillStyle = "#8edfff";
            ctx.fillRect(x + 3, y + 3, 27, 27);

            ctx.globalAlpha = 1;

        // Cristal principal
            ctx.fillStyle = "#6bbbd9";
            ctx.fillRect(x + 12, y + 7, 9, 18);
            ctx.fillRect(x + 9, y + 12, 15, 9);

        // Parte iluminada
            ctx.fillStyle = "#b8edff";
            ctx.fillRect(x + 14, y + 9, 5, 12);
            ctx.fillRect(x + 11, y + 13, 3, 6);

        // Brillo superior
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(x + 15, y + 7, 3, 5);
            ctx.fillRect(x + 12, y + 12, 3, 2);

        // Base oscura
            ctx.fillStyle = "#477eaa";
            ctx.fillRect(x + 12, y + 22, 9, 4);

            ctx.restore();
        }
    }
    // Pequeñas estrellas doradas de la montaña
    if (currentMap === "mountain") {

        const goldenStars = [

    // Parte izquierda
            { x: 1, y: 2, size: 0.65 },
            { x: 5, y: 3, size: 0.7 },
            { x: 8, y: 2, size: 0.55 },
            { x: 2, y: 6, size: 0.7 },
            { x: 6, y: 7, size: 0.6 },
            { x: 1, y: 9, size: 0.55 },
            { x: 5, y: 10, size: 0.7 },
            { x: 8, y: 11, size: 0.55 },
            { x: 2, y: 13, size: 0.7 },
            { x: 6, y: 14, size: 0.6 },
            { x: 1, y: 16, size: 0.65 },
            { x: 5, y: 18, size: 0.7 },
            { x: 8, y: 17, size: 0.55 },
            { x: 3, y: 19, size: 0.6 },

    // Parte central
            { x: 11, y: 2, size: 0.55 },
            { x: 12, y: 9, size: 0.65 },
            { x: 10, y: 16, size: 0.55 },
            { x: 16, y: 18, size: 0.6 },

    // Parte derecha
            { x: 22, y: 2, size: 0.6 },
            { x: 27, y: 5, size: 0.55 },
            { x: 24, y: 10, size: 0.65 },
            { x: 28, y: 13, size: 0.55 },
            { x: 22, y: 17, size: 0.6 }
        ];

        const time = Date.now() / 600;

        for (let i = 0; i < goldenStars.length; i++) {

            const star = goldenStars[i];

            const x = star.x * TILE + 16;
            const y = star.y * TILE + 16;
            const size = star.size;

            const glow = (Math.sin(time + i) + 1) / 2;

            ctx.save();

            ctx.translate(x, y);
            ctx.scale(size, size);

        // Resplandor
            ctx.globalAlpha = 0.15 + glow * 0.2;
            ctx.fillStyle = "#ffd447";
            ctx.fillRect(-9, -9, 18, 18);

            ctx.globalAlpha = 1;

        // Forma de estrella
            ctx.fillStyle = "#d99b25";
            ctx.fillRect(-2, -8, 4, 16);
            ctx.fillRect(-7, -2, 14, 4);
            ctx.fillRect(-5, -5, 10, 10);

        // Centro iluminado
            ctx.fillStyle = "#ffcf4d";
            ctx.fillRect(-1, -6, 2, 12);
            ctx.fillRect(-5, -1, 10, 2);
            ctx.fillRect(-3, -4, 6, 8);

        // Destello central
            ctx.fillStyle = "#fff3ad";
            ctx.fillRect(-1, -3, 2, 5);

            ctx.restore();
        }
    }
    // Faroles del Sendero de las Estrellas
        if (currentMap === "mountain") {


                const mountainLanterns = [
    // Segunda línea de faroles
                    { x: 16, y: 1, size: 1.4 },
                    { x: 14, y: 4, size: 1.4 },
                    { x: 16, y: 7, size: 1.4 },
                    { x: 14, y: 10, size: 1.4 },
                    { x: 16, y: 13, size: 1.4 },
                    { x: 14, y: 16, size: 1.4 }
                ];
            

            const time = Date.now() / 500;

            for (let i = 0; i < mountainLanterns.length; i++) {

                const lantern = mountainLanterns[i];

                const x = lantern.x * TILE;
                const y = lantern.y * TILE;
                const size = lantern.size;

                const glow = (Math.sin(time + i) + 1) / 2;

                ctx.save();

                ctx.translate(x, y);
                ctx.scale(size, size);
                ctx.translate(-x, -y);

        // Resplandor de la lámpara
                ctx.globalAlpha = 0.12 + glow * 0.12;
                ctx.fillStyle = "#ffd987";
                ctx.fillRect(x - 5, y - 5, 42, 42);

                ctx.globalAlpha = 1;

        // Sombra
                ctx.fillStyle = "rgba(20, 25, 35, 0.3)";
                ctx.fillRect(x + 7, y + 27, 21, 5);

        // Poste de madera
                ctx.fillStyle = "#594332";
                ctx.fillRect(x + 15, y + 10, 5, 19);

                ctx.fillStyle = "#98704b";
                ctx.fillRect(x + 16, y + 12, 2, 15);

        // Base
                ctx.fillStyle = "#493c35";
                ctx.fillRect(x + 10, y + 27, 15, 4);

        // Estructura de la lámpara
                ctx.fillStyle = "#493b32";
                ctx.fillRect(x + 10, y + 3, 15, 3);
                ctx.fillRect(x + 12, y + 5, 11, 13);
                ctx.fillRect(x + 9, y + 7, 3, 9);
                ctx.fillRect(x + 23, y + 7, 3, 9);

        // Cristal luminoso
                ctx.fillStyle = "#e9a94e";
                ctx.fillRect(x + 13, y + 7, 9, 10);

                ctx.fillStyle = "#ffe6a3";
                ctx.fillRect(x + 15, y + 8, 5, 7);

        // Techo
                ctx.fillStyle = "#604b3a";
                ctx.fillRect(x + 11, y, 13, 3);
                ctx.fillRect(x + 14, y - 2, 7, 3);

        // Brillo
                ctx.globalAlpha = 0.5 + glow * 0.5;
                ctx.fillStyle = "#fff2c4";
                ctx.fillRect(x + 15, y + 9, 2, 3);

                ctx.restore();
            }
        }
        // Nieve cayendo en la Montaña de las Estrellas
        if (currentMap === "mountain") {

            const time = Date.now() / 1000;

            const snowflakes = [
                { x: 3, y: 2, speed: 12, size: 2 },
                { x: 8, y: 7, speed: 18, size: 3 },
                { x: 14, y: 3, speed: 10, size: 2 },
                { x: 19, y: 10, speed: 15, size: 2 },
                { x: 25, y: 5, speed: 13, size: 3 },
                { x: 28, y: 14, speed: 17, size: 2 },
                { x: 6, y: 16, speed: 11, size: 2 },
                { x: 16, y: 18, speed: 14, size: 3 },
                { x: 22, y: 12, speed: 16, size: 2 },
                { x: 11, y: 9, speed: 12, size: 2 },
                { x: 4, y: 12, speed: 19, size: 3 },
                { x: 26, y: 18, speed: 10, size: 2 }
            ];

            for (let i = 0; i < snowflakes.length; i++) {

                const snow = snowflakes[i];

                const x = (
                    snow.x * TILE +
                    Math.sin(time + i) * 12
                );

                const y = (
                    snow.y * TILE +
                    time * snow.speed
                ) % (ROWS * TILE);

                ctx.save();

                ctx.globalAlpha = 0.65 + Math.sin(time * 2 + i) * 0.25;
                ctx.fillStyle = "#edf8ff";

                ctx.fillRect(x, y, snow.size, snow.size);

                ctx.restore();
            }
        }
        // Nubes flotando en la montaña
        if (currentMap === "mountain") {

            const time = Date.now() / 1000;

            const mountainClouds = [
                { x: 2, y: 3, speed: 5, size: 1 },
                { x: 15, y: 1, speed: 3, size: 1.3 },
                { x: 24, y: 5, speed: 4, size: 0.9 }
            ];

            for (const cloud of mountainClouds) {

                const x = (
                    cloud.x * TILE + time * cloud.speed
                ) % (COLS * TILE + 100) - 50;

                const y = cloud.y * TILE;

                ctx.save();

                ctx.globalAlpha = 0.35;

                ctx.translate(x, y);
                ctx.scale(cloud.size, cloud.size);

        // Cuerpo de la nube
                ctx.fillStyle = "#dce8f0";
                ctx.fillRect(0, 9, 42, 10);
                ctx.fillRect(8, 3, 25, 12);
                ctx.fillRect(17, 0, 13, 12);

        // Parte iluminada
                ctx.fillStyle = "#f5faff";
                ctx.fillRect(8, 6, 17, 5);
                ctx.fillRect(19, 3, 9, 5);

                ctx.restore();
            }
        }

    // Luciérnagas del Bosque de los Recuerdos
    if (currentMap === "forest") {

        const time = Date.now() / 500;

        for (let i = 0; i < forestFireflies.length; i++) {

            const fly = forestFireflies[i];

            const x = fly.x * TILE + Math.sin(time * fly.speed + i) * 7;
            const y = fly.y * TILE + Math.cos(time * fly.speed + i) * 5;

            const glow = (Math.sin(time * fly.speed + i) + 1) / 2;

            ctx.save();

            ctx.globalAlpha = 0.4 + glow * 0.6;

        // Resplandor
            ctx.fillStyle = "#dfff91";
            ctx.fillRect(
                x - fly.size * 2,
                y - fly.size * 2,
                fly.size * 4,
                fly.size * 4
            );

        // Centro luminoso
            ctx.fillStyle = "#f5ffb5";
            ctx.fillRect(
                x - fly.size / 2,
                y - fly.size / 2,
                fly.size,
                fly.size
            );

            ctx.restore();
        }
    }
    // Hojas que caen en el Bosque de los Recuerdos
    if (currentMap === "forest") {

        const time = Date.now() / 500;

        for (let i = 0; i < forestLeaves.length; i++) {

            const leaf = forestLeaves[i];

        // Movimiento de caída
            const fall =
                (leaf.y * TILE + time * leaf.speed * 8) %
                (ROWS * TILE);

        // Balanceo con el viento
            const sway =
                Math.sin(time * leaf.speed + i) * 12;

            const x = leaf.x * TILE + sway;
            const y = fall;

            ctx.save();

            ctx.globalAlpha = 0.85;

        // Cuerpo de la hoja
            ctx.fillStyle = leaf.color;
            ctx.fillRect(x, y, 6, 3);
            ctx.fillRect(x + 2, y - 2, 3, 2);
            ctx.fillRect(x + 2, y + 3, 2, 1);

        // Pequeño tallo
            ctx.fillStyle = "#657747";
            ctx.fillRect(x + 5, y + 1, 2, 1);

            ctx.restore();
        }
    }
    // Ranitas del Bosque de los Recuerdos
    if (currentMap === "forest") {

        const forestFrogs = [
            { x: 7, y: 11, speed: 1.5, phase: 0 },
            { x: 13, y: 12, speed: 1.2, phase: 2 },
            { x: 24, y: 8, speed: 1.7, phase: 4 },
            { x: 10, y: 16, speed: 1.3, phase: 1 }
        ];

        const time = Date.now() / 1000;

        for (const frog of forestFrogs) {

            const x = frog.x * TILE;
            const jump = Math.max(
                0,
                Math.sin(time * frog.speed + frog.phase)
            ) * 5;

            const y = frog.y * TILE - jump;

            ctx.save();

        // Sombra
            ctx.fillStyle = "rgba(20, 45, 25, 0.3)";
            ctx.fillRect(x + 8, y + 25 + jump, 17, 4);

        // Patitas
            ctx.fillStyle = "#397b45";
            ctx.fillRect(x + 5, y + 19, 7, 5);
            ctx.fillRect(x + 21, y + 19, 7, 5);

        // Cuerpo
            ctx.fillStyle = "#4eaa59";
            ctx.fillRect(x + 7, y + 12, 19, 12);
            ctx.fillRect(x + 10, y + 9, 13, 15);

        // Barriguita
            ctx.fillStyle = "#a8d77b";
            ctx.fillRect(x + 11, y + 18, 11, 5);

        // Ojos saltones
            ctx.fillStyle = "#4eaa59";
            ctx.fillRect(x + 7, y + 6, 7, 8);
            ctx.fillRect(x + 20, y + 6, 7, 8);

        // Ojos claros
            ctx.fillStyle = "#f4f3d2";
            ctx.fillRect(x + 9, y + 7, 4, 5);
            ctx.fillRect(x + 21, y + 7, 4, 5);

        // Pupilas
            ctx.fillStyle = "#263b2b";
            ctx.fillRect(x + 10, y + 8, 2, 3);
            ctx.fillRect(x + 22, y + 8, 2, 3);

        // Sonrisa
            ctx.fillStyle = "#315d39";
            ctx.fillRect(x + 14, y + 17, 5, 2);

            ctx.restore();
        }
    }
    // Pequeñas olas animadas del océano
    if (currentMap === "sea") {

        const time = Date.now() / 500;

        for (let i = 0; i < 12; i++) {

            const waveX =
                ((i * 83 + time * 12) % (COLS * TILE));

            const waveY =
                (i * 37) % (6 * TILE);

            ctx.save();

            ctx.globalAlpha = 0.45;

        // Reflejo principal
            ctx.fillStyle = "#b9e9df";
            ctx.fillRect(waveX, waveY, 13, 2);

        // Pequeña espuma
            ctx.fillStyle = "#e4fff2";
            ctx.fillRect(waveX + 4, waveY - 2, 6, 2);

            ctx.restore();
        }
    }
    // Olas grandes animadas del océano
    if (currentMap === "sea") {

        const time = Date.now() / 700;

        for (let i = 0; i < 7; i++) {

            const waveX =
                ((i * 113 + time * 18) % (COLS * TILE));

            const waveY =
                (i * 47) % (6 * TILE);

            ctx.save();

        // Cuerpo de la ola
            ctx.globalAlpha = 0.45;
            ctx.fillStyle = "#8dd5d0";
            ctx.fillRect(waveX, waveY, 34, 5);
            ctx.fillRect(waveX + 7, waveY - 3, 23, 4);

        // Espuma superior
            ctx.globalAlpha = 0.75;
            ctx.fillStyle = "#e4fff2";
            ctx.fillRect(waveX + 5, waveY - 4, 19, 3);
            ctx.fillRect(waveX + 26, waveY - 2, 8, 2);

        // Reflejo inferior
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = "#c5f2e8";
            ctx.fillRect(waveX + 10, waveY + 6, 20, 2);

            ctx.restore();
        }
    }
    // Peces nadando bajo el océano
    if (currentMap === "sea") {

        const seaFish = [
            { x: 4, y: 3, speed: 0.7, color: "#b8e5e8" },
            { x: 12, y: 5, speed: 1.0, color: "#8ed1df" },
            { x: 21, y: 2, speed: 0.8, color: "#d0eeee" },
            { x: 26, y: 5, speed: 1.2, color: "#91c9d9" }
        ];

        const time = Date.now() / 1000;

        for (let i = 0; i < seaFish.length; i++) {

            const fish = seaFish[i];

            const x = (
                fish.x * TILE + time * fish.speed * 12
            ) % (COLS * TILE);

            const y = fish.y * TILE +
                Math.sin(time * 2 + i) * 3;

            ctx.save();

            ctx.fillStyle = fish.color;

        // Cuerpo
            ctx.fillRect(x + 5, y + 2, 12, 6);
            ctx.fillRect(x + 8, y, 7, 2);

        // Cola
            ctx.fillRect(x + 1, y + 2, 4, 3);
            ctx.fillRect(x + 3, y, 3, 2);

        // Aleta
            ctx.fillRect(x + 10, y + 8, 5, 2);

        // Ojo
            ctx.fillStyle = "#31566b";
            ctx.fillRect(x + 14, y + 3, 2, 2);

            ctx.restore();
        }
    }
    // Gaviotas volando sobre el océano
        if (currentMap === "sea") {

            const seaBirds = [
                { x: 5, y: 2, speed: 0.8 },
                { x: 13, y: 4, speed: 1.1 },
                { x: 23, y: 2, speed: 0.7 },
                { x: 18, y: 5, speed: 0.9 }
            ];

            const time = Date.now() / 1000;

            for (let i = 0; i < seaBirds.length; i++) {

                const bird = seaBirds[i];

                const x = bird.x * TILE +
                    Math.sin(time * bird.speed + i) * 5;

                const y = bird.y * TILE +
                    Math.sin(time * 2 + i) * 2;

                ctx.save();

                ctx.fillStyle = "#fff8e8";

        // Ala izquierda
                ctx.fillRect(x, y + 3, 5, 2);
                ctx.fillRect(x + 3, y + 1, 4, 2);

        // Centro del ave
                ctx.fillRect(x + 6, y + 3, 5, 2);

        // Ala derecha
                ctx.fillRect(x + 10, y + 1, 4, 2);
                ctx.fillRect(x + 13, y + 3, 5, 2);

                ctx.restore();
            }
        }

        // Montículos de nieve de la montaña
        if (currentMap === "mountain") {

            const snowMounds = [
                { x: 2, y: 8 },
                { x: 11, y: 3 },
                { x: 16, y: 10 },
                { x: 26, y: 8 },
                { x: 6, y: 17 },
                { x: 25, y: 17 },
                { x: 12, y: 15 }
            ];

            for (const mound of snowMounds) {

                const x = mound.x * TILE;
                const y = mound.y * TILE;

        // Sombra
                ctx.fillStyle = "#65788d";
                ctx.fillRect(x + 5, y + 23, 23, 6);

        // Base de nieve
                ctx.fillStyle = "#b8cbd9";
                ctx.fillRect(x + 7, y + 17, 19, 8);
                ctx.fillRect(x + 11, y + 13, 12, 6);

        // Brillo superior
                ctx.fillStyle = "#edf7ff";
                ctx.fillRect(x + 12, y + 14, 9, 3);
                ctx.fillRect(x + 9, y + 18, 5, 2);
            }
        }

}

function drawMountainPines() {

    if (currentMap !== "mountain") return;

    const mountainPines = [

    // Fila superior
        { x: 19, y: 0, size: 1.2 },
        { x: 22, y: 0, size: 1.5 },
        { x: 25, y: 0, size: 1.3 },
        { x: 28, y: 0, size: 1.5 },
        { x: 20, y: 2, size: 1.6 },
        { x: 23, y: 2, size: 1.2 },
        { x: 26, y: 2, size: 1.7 },
        { x: 29, y: 2, size: 1.3 },

    // Segunda franja
        { x: 19, y: 4, size: 1.5 },
        { x: 22, y: 4, size: 1.3 },
        { x: 25, y: 4, size: 1.6 },
        { x: 28, y: 4, size: 1.4 },
        { x: 20, y: 6, size: 1.3 },
        { x: 23, y: 6, size: 1.7 },
        { x: 26, y: 6, size: 1.4 },
        { x: 29, y: 6, size: 1.6 },

    // Tercera franja
        { x: 19, y: 8, size: 1.7 },
        { x: 22, y: 8, size: 1.4 },
        { x: 25, y: 8, size: 1.5 },
        { x: 28, y: 8, size: 1.8 },
        { x: 20, y: 10, size: 1.5 },
        { x: 23, y: 10, size: 1.3 },
        { x: 26, y: 10, size: 1.7 },
        { x: 29, y: 10, size: 1.4 },

    // Cuarta franja
        { x: 19, y: 12, size: 1.4 },
        { x: 22, y: 12, size: 1.7 },
        { x: 25, y: 12, size: 1.3 },
        { x: 28, y: 12, size: 1.6 },
        { x: 20, y: 14, size: 1.7 },
        { x: 23, y: 14, size: 1.5 },
        { x: 26, y: 14, size: 1.8 },
        { x: 29, y: 14, size: 1.3 },

    // Quinta franja
        { x: 19, y: 16, size: 1.5 },
        { x: 22, y: 16, size: 1.3 },
        { x: 25, y: 16, size: 1.7 },
        { x: 28, y: 16, size: 1.5 },
        { x: 20, y: 18, size: 1.6 },
        { x: 23, y: 18, size: 1.4 },
        { x: 26, y: 18, size: 1.7 },
        { x: 29, y: 18, size: 1.5 },

    // Pinos adicionales para rellenar huecos
        { x: 21, y: 1, size: 1.3 },
        { x: 24, y: 3, size: 1.5 },
        { x: 27, y: 1, size: 1.4 },
        { x: 21, y: 5, size: 1.6 },
        { x: 24, y: 7, size: 1.4 },
        { x: 27, y: 5, size: 1.7 },
        { x: 21, y: 9, size: 1.5 },
        { x: 24, y: 11, size: 1.6 },
        { x: 27, y: 9, size: 1.4 },
        { x: 21, y: 13, size: 1.4 },
        { x: 24, y: 15, size: 1.7 },
        { x: 27, y: 13, size: 1.5 },
        { x: 21, y: 17, size: 1.6 },
        { x: 24, y: 19, size: 1.3 },
        { x: 27, y: 17, size: 1.6 },
        { x: 29, y: 19, size: 1.3 },
            // Últimos pinos para hacer el bosque aún más frondoso
        { x: 18, y: 1, size: 1.5 },
        { x: 23, y: 1, size: 1.7 },
        { x: 27, y: 3, size: 1.6 },
        { x: 19, y: 3, size: 1.4 },
        { x: 22, y: 5, size: 1.8 },
        { x: 25, y: 5, size: 1.5 },
        { x: 29, y: 3, size: 1.7 },
        { x: 18, y: 7, size: 1.6 },
        { x: 23, y: 9, size: 1.8 },
        { x: 27, y: 7, size: 1.5 },
        { x: 19, y: 11, size: 1.7 },
        { x: 25, y: 11, size: 1.6 },
        { x: 29, y: 11, size: 1.8 },
        { x: 22, y: 13, size: 1.7 },
        { x: 26, y: 15, size: 1.6 },
        { x: 18, y: 15, size: 1.5 },
        { x: 23, y: 17, size: 1.8 },
        { x: 28, y: 17, size: 1.7 },
        { x: 19, y: 19, size: 1.6 },
        { x: 25, y: 18, size: 1.8 }
    ];

    for (const pine of mountainPines) {

        const px = pine.x * TILE;
        const py = pine.y * TILE;
        const s = pine.size;

        ctx.save();

        // Tronco
        ctx.fillStyle = "#55483f";
        ctx.fillRect(px + 14 * s, py + 21 * s, 6 * s, 12 * s);

        // Copa inferior
        ctx.fillStyle = "#294b48";
        ctx.fillRect(px + 5 * s, py + 16 * s, 24 * s, 9 * s);
        ctx.fillRect(px + 9 * s, py + 11 * s, 16 * s, 8 * s);

        // Copa central
        ctx.fillStyle = "#356157";
        ctx.fillRect(px + 8 * s, py + 9 * s, 18 * s, 8 * s);
        ctx.fillRect(px + 11 * s, py + 4 * s, 12 * s, 8 * s);

        // Punta
        ctx.fillStyle = "#477568";
        ctx.fillRect(px + 14 * s, py, 6 * s, 7 * s);

        // Nieve sobre las ramas
        ctx.fillStyle = "#dcebf0";
        ctx.fillRect(px + 14 * s, py + 1 * s, 5 * s, 2 * s);
        ctx.fillRect(px + 11 * s, py + 7 * s, 9 * s, 3 * s);
        ctx.fillRect(px + 8 * s, py + 13 * s, 8 * s, 3 * s);
        ctx.fillRect(px + 19 * s, py + 18 * s, 7 * s, 3 * s);

        // Brillos de la nieve
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(px + 15 * s, py + 1 * s, 3 * s, 1 * s);
        ctx.fillRect(px + 12 * s, py + 7 * s, 5 * s, 1 * s);

        ctx.restore();
    }
}

// DIBUJAR CASAS
function drawHouses() {

    if (currentMap !== "village") return;

    houses.forEach((house, index) => {

        const x = house.x * TILE;
        const y = house.y * TILE;

        // Sombra de la casa
        ctx.fillStyle = "rgba(25, 35, 25, 0.25)";
        ctx.fillRect(x + 5, y + 80, 120, 12);

        // Paredes
        ctx.fillStyle = "#c9b58c";
        ctx.fillRect(x + 5, y + 18, 118, 70);

        // Parte iluminada de la pared
        ctx.fillStyle = "#e3d1a9";
        ctx.fillRect(x + 10, y + 23, 108, 58);

        // Detalles de madera
        ctx.fillStyle = "#a98760";
        ctx.fillRect(x + 8, y + 27, 4, 55);
        ctx.fillRect(x + 116, y + 27, 4, 55);
        ctx.fillRect(x + 14, y + 82, 100, 4);

        // Techo: silueta exterior
        ctx.fillStyle = "#653d38";
        ctx.fillRect(x - 5, y + 5, 138, 30);
        ctx.fillRect(x + 5, y, 118, 38);

        // Techo principal
        ctx.fillStyle = index % 2 === 0 ? "#985348" : "#79504b";
        ctx.fillRect(x + 3, y + 5, 122, 24);
        ctx.fillRect(x + 10, y, 108, 28);

        // Tejas
        ctx.fillStyle = "#b66d59";
        ctx.fillRect(x + 14, y + 5, 25, 6);
        ctx.fillRect(x + 48, y + 5, 25, 6);
        ctx.fillRect(x + 82, y + 5, 25, 6);

        ctx.fillStyle = "#81463e";
        ctx.fillRect(x + 25, y + 17, 25, 5);
        ctx.fillRect(x + 61, y + 17, 25, 5);
        ctx.fillRect(x + 96, y + 17, 18, 5);

        // Puerta
        ctx.fillStyle = "#593c2d";
        ctx.fillRect(x + 49, y + 53, 30, 35);

        // Interior de la puerta
        ctx.fillStyle = "#916344";
        ctx.fillRect(x + 53, y + 57, 22, 31);

        // Picaporte
        ctx.fillStyle = "#e5c36b";
        ctx.fillRect(x + 69, y + 73, 3, 3);

        // Ventanas
        for (const wx of [17, 91]) {

            ctx.fillStyle = "#76513b";
            ctx.fillRect(x + wx - 3, y + 37, 27, 25);

            ctx.fillStyle = "#f3d58a";
            ctx.fillRect(x + wx, y + 40, 21, 19);

            ctx.fillStyle = "#91c7c9";
            ctx.fillRect(x + wx + 3, y + 43, 15, 13);

            // Marcos de las ventanas
            ctx.fillStyle = "#76513b";
            ctx.fillRect(x + wx + 9, y + 40, 3, 19);
            ctx.fillRect(x + wx, y + 48, 21, 3);
        }

        // Pequeña chimenea
        ctx.fillStyle = "#70453d";
        ctx.fillRect(x + 91, y - 9, 13, 18);

        ctx.fillStyle = "#a96a55";
        ctx.fillRect(x + 88, y - 11, 19, 5);

    // Faroles junto a la puerta
        ctx.fillStyle = "#62452f";
        ctx.fillRect(x + 39, y + 57, 5, 12);
        ctx.fillRect(x + 84, y + 57, 5, 12);

// Luz de los faroles
        ctx.fillStyle = "#f5d78b";
        ctx.fillRect(x + 38, y + 53, 7, 7);
        ctx.fillRect(x + 83, y + 53, 7, 7);

// Macetas
        for (const potX of [17, 104]) {

            ctx.fillStyle = "#a65e48";
            ctx.fillRect(x + potX, y + 77, 12, 10);

            ctx.fillStyle = "#d28a62";
            ctx.fillRect(x + potX - 1, y + 76, 14, 3);

    // Tallos
            ctx.fillStyle = "#477c43";
            ctx.fillRect(x + potX + 5, y + 69, 3, 8);

    // Flores
            ctx.fillStyle = "#e99cbd";
            ctx.fillRect(x + potX + 2, y + 65, 5, 5);
            ctx.fillRect(x + potX + 7, y + 65, 5, 5);

            ctx.fillStyle = "#f3d36e";
            ctx.fillRect(x + potX + 5, y + 67, 4, 4);
        }

    });

}


function drawStreetLights() {

    if (currentMap !== "village") return;

    const lampPositions = [
        { x: 12, y: 8 },
        { x: 17, y: 8 },
        { x: 12, y: 11 },
        { x: 16, y: 13 },
        { x: 5, y: 11 },
        { x: 24, y: 11 },
        { x: 13, y: 16 },
        { x: 8, y: 8 },
        { x: 16, y: 5 }
    ];

    for (const lamp of lampPositions) {

        const x = lamp.x * TILE;
        const y = lamp.y * TILE;

        // Sombra
        ctx.fillStyle = "rgba(25, 35, 25, 0.25)";
        ctx.fillRect(x + 9, y + 25, 16, 5);

        // Poste de madera
        ctx.fillStyle = "#65452f";
        ctx.fillRect(x + 14, y + 7, 6, 23);

        // Brazo superior
        ctx.fillRect(x + 8, y + 7, 12, 4);

        // Soporte del farol
        ctx.fillStyle = "#4c392b";
        ctx.fillRect(x + 9, y + 3, 13, 3);

        // Farol
        ctx.fillStyle = "#8b6540";
        ctx.fillRect(x + 8, y - 5, 14, 10);

        // Cristal iluminado
        ctx.fillStyle = "#f5d887";
        ctx.fillRect(x + 11, y - 3, 8, 6);

        // Brillo central
        ctx.fillStyle = "#fff1b8";
        ctx.fillRect(x + 13, y - 2, 4, 4);

        // Parte superior
        ctx.fillStyle = "#60432f";
        ctx.fillRect(x + 7, y - 7, 16, 3);

    }
}


function drawVillageDecorations() {

    if (currentMap !== "village") return;

    // Bancos de madera
    const benches = [
        { x: 5, y: 8 },
        { x: 20, y: 11 }
    ];

    for (const bench of benches) {

        const x = bench.x * TILE;
        const y = bench.y * TILE;

        // Patas
        ctx.fillStyle = "#63432e";
        ctx.fillRect(x + 7, y + 17, 4, 10);
        ctx.fillRect(x + 23, y + 17, 4, 10);

        // Asiento
        ctx.fillStyle = "#95633e";
        ctx.fillRect(x + 4, y + 12, 27, 7);

        // Detalle de madera
        ctx.fillStyle = "#bd8955";
        ctx.fillRect(x + 6, y + 13, 22, 2);

        // Respaldo
        ctx.fillStyle = "#754a30";
        ctx.fillRect(x + 5, y + 4, 25, 7);

        ctx.fillStyle = "#a87549";
        ctx.fillRect(x + 7, y + 5, 21, 3);

        
    // Pequeño estanque decorativo
        const pondX = 17 * TILE;
        const pondY = 3 * TILE;

    // Sombra exterior
        ctx.fillStyle = "#6c765d";
        ctx.fillRect(pondX + 2, pondY + 5, 30, 22);
        ctx.fillRect(pondX + 7, pondY + 1, 22, 30);

    // Borde de piedra
        ctx.fillStyle = "#858c7c";
        ctx.fillRect(pondX + 5, pondY + 4, 23, 23);
        ctx.fillRect(pondX + 2, pondY + 9, 29, 13);

    // Agua
        ctx.fillStyle = "#397f9b";
        ctx.fillRect(pondX + 8, pondY + 8, 17, 15);

        ctx.fillStyle = "#4b9bb0";
        ctx.fillRect(pondX + 11, pondY + 10, 10, 3);

    // Reflejos del agua
        ctx.fillStyle = "#a3d5d0";
        ctx.fillRect(pondX + 12, pondY + 15, 7, 2);
        ctx.fillRect(pondX + 20, pondY + 11, 3, 2);

    // Piedritas alrededor
        ctx.fillStyle = "#b3b5a1";
        ctx.fillRect(pondX + 5, pondY + 5, 5, 4);
        ctx.fillRect(pondX + 24, pondY + 7, 4, 5);
        ctx.fillRect(pondX + 6, pondY + 23, 5, 3);

    // Flores junto al agua
        ctx.fillStyle = "#e9a9c5";
        ctx.fillRect(pondX + 1, pondY + 2, 4, 4);
        ctx.fillRect(pondX + 28, pondY + 25, 4, 4);

        ctx.fillStyle = "#f3d36e";
        ctx.fillRect(pondX + 2, pondY + 3, 2, 2);
        ctx.fillRect(pondX + 29, pondY + 26, 2, 2);

        }

    // Piedras decorativas
    const stones = [
        { x: 3, y: 11 },
        { x: 9, y: 7 },
        { x: 20, y: 8 },
        { x: 26, y: 16 },
        { x: 11, y: 18 },
        { x: 2, y: 16 },
        { x: 19, y: 17 }
    ];

    for (const stone of stones) {

        const x = stone.x * TILE;
        const y = stone.y * TILE;

        ctx.fillStyle = "#777d72";
        ctx.fillRect(x + 9, y + 14, 14, 9);

        ctx.fillStyle = "#a5a99a";
        ctx.fillRect(x + 12, y + 12, 8, 5);

        ctx.fillStyle = "#c1c2ad";
        ctx.fillRect(x + 13, y + 13, 4, 2);
    }
}



function drawNPCs() {

    if (currentMap === "forest") {

        for (const npc of forestNPCs) {

            const x = npc.x * TILE;
            const y = npc.y * TILE;

            // Skin de la Guardiana
            if (guardianaSkin.complete && guardianaSkin.naturalWidth > 0) {

                ctx.drawImage(
                    guardianaSkin,
                    170, 100, 760, 1200,
                    x, y - 22, 32, 54
                );
            }

            // Nombre de la Guardiana
            ctx.fillStyle = "#eee7d9";
            ctx.font = "10px Georgia";
            ctx.textAlign = "center";
            ctx.fillText("Guardiana", x + 16, y - 25);
        }

        return;
    }
    if (currentMap === "sea") return;
    // Personaje del encuentro final
    if (currentMap === "final") {

        const x = finalCharacter.x * TILE;
        const y = finalCharacter.y * TILE;

        // Skin de Gabriel
        if (gabrielSkin.complete && gabrielSkin.naturalWidth > 0) {

            ctx.drawImage(
                gabrielSkin,

                // Primera pose del sprite original
                35, 5, 185, 305,

                // Posición y tamaño dentro del mapa
                x, y - 22, 32, 54
            );
        }

        // Nombre del personaje
        ctx.fillStyle = "#eee7d9";
        ctx.font = "10px Georgia";
        ctx.textAlign = "center";
        ctx.fillText("Gabriel", x + 16, y - 25);

        return;
    }

    if (currentMap !== "village") return;

    for (const npc of npcs) {

        const x = npc.x * TILE;
        const y = npc.y * TILE;

        // Skin de Desconocido
        if (npc.name === "Desconocido") {

            if (desconocidoSkin.complete && desconocidoSkin.naturalWidth > 0) {

                ctx.drawImage(
                    desconocidoSkin,
                    345, 130, 565, 956,
                    x, y - 22, 32, 54
                );
            }

        } else if (npc.name === "Viajero") {

    // Nuevo skin del Viajero
            if (viajeroSkin.complete && viajeroSkin.naturalWidth > 0) {

                ctx.drawImage(
                    viajeroSkin,
                    155, 40, 750, 1340,
                    x, y - 22, 32, 54
                );
            }
        }

        // Nombre del personaje
        ctx.fillStyle = "#eee7d9";
        ctx.font = "10px Georgia";
        ctx.textAlign = "center";
        ctx.fillText(npc.name, x + 16, y - 25);
    }
}


function drawObjects() {

    const activeObjects = currentMap === "forest"
        ? forestObjects
        : currentMap === "village"
            ? objects
            : [];

    // Objetos de la aldea y del bosque
    for (const object of activeObjects) {

        if (object.collected) continue;

        const x = object.x * TILE;
        const y = object.y * TILE;

        if (object.name === "Flor silvestre") {

            ctx.fillStyle = "#4f9b57";
            ctx.fillRect(x + 15, y + 14, 2, 10);

            // Hojas
            ctx.fillStyle = "#75b96a";
            ctx.fillRect(x + 11, y + 18, 5, 3);

            // Pétalos
            ctx.fillStyle = "#e9b9d0";
            ctx.fillRect(x + 11, y + 5, 5, 5);
            ctx.fillRect(x + 17, y + 5, 5, 5);
            ctx.fillRect(x + 11, y + 11, 5, 5);
            ctx.fillRect(x + 17, y + 11, 5, 5);

            // Centro
            ctx.fillStyle = "#f5d76e";
            ctx.fillRect(x + 15, y + 9, 4, 4);

        } else {

            ctx.fillStyle = "#e8d8ad";
            ctx.fillRect(x + 9, y + 10, 14, 12);

            ctx.fillStyle = "#9b8060";
            ctx.fillRect(x + 12, y + 13, 8, 1);
            ctx.fillRect(x + 12, y + 16, 6, 1);

        }

    }

        // Flores decorativas de la aldea
    if (currentMap === "village") {

        const villageFlowers = [
            { x: 3, y: 6 },
            { x: 6, y: 5 },
            { x: 10, y: 3 },
            { x: 18, y: 5 },
            { x: 21, y: 7 },
            { x: 27, y: 7 },
            { x: 4, y: 15 },
            { x: 11, y: 17 },
            { x: 20, y: 14 },
            { x: 26, y: 17 }
        ];

        for (const flower of villageFlowers) {

            const x = flower.x * TILE;
            const y = flower.y * TILE;

            // Tallo
            ctx.fillStyle = "#43864b";
            ctx.fillRect(x + 15, y + 14, 3, 9);

            // Hojas
            ctx.fillStyle = "#70a95b";
            ctx.fillRect(x + 10, y + 18, 5, 3);
            ctx.fillRect(x + 18, y + 16, 5, 3);

            // Pétalos
            ctx.fillStyle = "#f0b6d0";
            ctx.fillRect(x + 13, y + 5, 5, 5);
            ctx.fillRect(x + 8, y + 10, 5, 5);
            ctx.fillRect(x + 18, y + 10, 5, 5);
            ctx.fillRect(x + 13, y + 15, 5, 4);

            // Centro
            ctx.fillStyle = "#f5d76e";
            ctx.fillRect(x + 14, y + 10, 4, 4);

        }

    }

    // Flores silvestres del bosque
    if (currentMap === "forest") {

        const forestFlowers = [
            { x: 4, y: 5, color: "#e8a6c8" },
            { x: 8, y: 3, color: "#f4d66d" },
            { x: 11, y: 6, color: "#eee9dc" },
            { x: 18, y: 5, color: "#b99add" },
            { x: 24, y: 4, color: "#8fc8e8" },
            { x: 2, y: 10, color: "#f4d66d" },
            { x: 8, y: 10, color: "#e8a6c8" },
            { x: 13, y: 8, color: "#eee9dc" },
            { x: 20, y: 9, color: "#b99add" },
            { x: 26, y: 10, color: "#8fc8e8" },
            { x: 4, y: 13, color: "#b99add" },
            { x: 10, y: 14, color: "#f4d66d" },
            { x: 16, y: 13, color: "#e8a6c8" },
            { x: 23, y: 13, color: "#eee9dc" },
            { x: 27, y: 15, color: "#8fc8e8" },
            { x: 5, y: 18, color: "#f4d66d" },
            { x: 11, y: 17, color: "#b99add" },
            { x: 18, y: 18, color: "#e8a6c8" },
            { x: 24, y: 17, color: "#eee9dc" }
        ];

        for (const flower of forestFlowers) {

            const x = flower.x * TILE;
            const y = flower.y * TILE;

        // Tallo
            ctx.fillStyle = "#43864b";
            ctx.fillRect(x + 15, y + 14, 3, 9);

        // Hojas
            ctx.fillStyle = "#70a95b";
            ctx.fillRect(x + 10, y + 18, 5, 3);
            ctx.fillRect(x + 18, y + 16, 5, 3);

        // Pétalos
            ctx.fillStyle = flower.color;
            ctx.fillRect(x + 13, y + 5, 5, 5);
            ctx.fillRect(x + 8, y + 10, 5, 5);
            ctx.fillRect(x + 18, y + 10, 5, 5);
            ctx.fillRect(x + 13, y + 15, 5, 4);

        // Centro
            ctx.fillStyle = "#f5d76e";
            ctx.fillRect(x + 14, y + 10, 4, 4);
        }
    }

    // Hongos decorativos del bosque
    if (currentMap === "forest") {

        const forestMushrooms = [
            { x: 2, y: 4, color: "#c95757" },
            { x: 6, y: 7, color: "#d8c49a" },
            { x: 13, y: 5, color: "#a783c5" },
            { x: 20, y: 4, color: "#c95757" },
            { x: 26, y: 5, color: "#d8c49a" },
            { x: 3, y: 11, color: "#a783c5" },
            { x: 6, y: 14, color: "#c95757" },
            { x: 13, y: 13, color: "#d8c49a" },
            { x: 21, y: 11, color: "#a783c5" },
            { x: 27, y: 13, color: "#c95757" },
            { x: 4, y: 17, color: "#d8c49a" },
            { x: 14, y: 18, color: "#a783c5" },
            { x: 23, y: 17, color: "#c95757" }
        ];

        for (const mushroom of forestMushrooms) {

            const x = mushroom.x * TILE;
            const y = mushroom.y * TILE;

        // Sombra
            ctx.fillStyle = "rgba(25, 40, 25, 0.3)";
            ctx.fillRect(x + 7, y + 25, 19, 4);

        // Tallo
            ctx.fillStyle = "#e8dfc5";
            ctx.fillRect(x + 13, y + 15, 9, 12);

        // Sombra del tallo
            ctx.fillStyle = "#c8bda5";
            ctx.fillRect(x + 18, y + 17, 4, 9);

        // Sombrero
            ctx.fillStyle = mushroom.color;
            ctx.fillRect(x + 7, y + 12, 21, 7);
            ctx.fillRect(x + 10, y + 8, 15, 6);
            ctx.fillRect(x + 13, y + 6, 9, 4);

        // Pequeños puntos decorativos
            ctx.fillStyle = "#f5e9d1";
            ctx.fillRect(x + 12, y + 11, 3, 3);
            ctx.fillRect(x + 21, y + 13, 3, 2);
        }
    }

    // Conchas de la playa
    if (currentMap === "sea") {


        for (const shell of seaCollectibles) {

            if (shell.collected) continue;

            const x = shell.x * TILE;
            const y = shell.y * TILE;

            // Cuerpo de la concha
            ctx.fillStyle = "#f1d5c0";
            ctx.fillRect(x + 9, y + 13, 14, 9);

            // Parte superior
            ctx.fillStyle = "#e9a9a9";
            ctx.fillRect(x + 11, y + 9, 10, 5);

            // Detalles
            ctx.fillStyle = "#fff0df";
            ctx.fillRect(x + 13, y + 11, 2, 7);
            ctx.fillRect(x + 17, y + 11, 2, 7);

        }

        // Mensaje del océano
        const allShellsCollected = seaCollectibles.every(
            shell => shell.collected
        );

        if (allShellsCollected && !seaMessage.collected) {

            const x = seaMessage.x * TILE;
            const y = seaMessage.y * TILE;

            // Papel
            ctx.fillStyle = "#e8d8ad";
            ctx.fillRect(x + 8, y + 7, 16, 18);

            // Líneas del mensaje
            ctx.fillStyle = "#9b8060";
            ctx.fillRect(x + 11, y + 11, 10, 2);
            ctx.fillRect(x + 11, y + 15, 8, 2);
            ctx.fillRect(x + 11, y + 19, 10, 2);

        }

    }
    // Fragmentos de estrella de la montaña
    if (currentMap === "mountain") {

        for (const star of mountainCollectibles) {

            if (star.collected) continue;

            const x = star.x * TILE;
            const y = star.y * TILE;

        // Luz de la estrella
            ctx.fillStyle = "#fff2a6";
            ctx.fillRect(x + 10, y + 5, 12, 22);
            ctx.fillRect(x + 5, y + 10, 22, 12);

        // Centro brillante
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(x + 12, y + 10, 8, 12);

        }

    }
    // Último mensaje de la montaña
    if (
        currentMap === "mountain" &&
        mountainCollectibles.every(star => star.collected) &&
        !mountainMessage.collected
    ) {

        const x = mountainMessage.x * TILE;
        const y = mountainMessage.y * TILE;

    // Pergamino
        ctx.fillStyle = "#e8d8ad";
        ctx.fillRect(x + 7, y + 6, 18, 21);

    // Líneas del mensaje
        ctx.fillStyle = "#9b8060";
        ctx.fillRect(x + 10, y + 11, 12, 2);
        ctx.fillRect(x + 10, y + 16, 9, 2);
        ctx.fillRect(x + 10, y + 21, 12, 2);

    }
    // Carta final
    if (
        currentMap === "final" &&
        finalCharacter.currentDialogue >= finalCharacter.dialogues.length &&
        !finalLetter.collected
    ) {

        const x = finalLetter.x * TILE;
        const y = finalLetter.y * TILE;

    // Papel
        ctx.fillStyle = "#f1dfb9";
        ctx.fillRect(x + 7, y + 5, 18, 22);

    // Líneas de la carta
        ctx.fillStyle = "#a58b68";
        ctx.fillRect(x + 10, y + 10, 12, 2);
        ctx.fillRect(x + 10, y + 15, 9, 2);
        ctx.fillRect(x + 10, y + 20, 12, 2);

    // Sello
        ctx.fillStyle = "#bd6475";
        ctx.fillRect(x + 14, y + 22, 5, 5);

    }

}




function interactWithObject() {

    // Objetos de la playa
    if (currentMap === "sea") {

        // Comprobar si se recogieron las tres conchas
        const allShellsCollected = seaCollectibles.every(
            shell => shell.collected
        );

        // Recoger el mensaje del océano
        if (
            allShellsCollected &&
            !seaMessage.collected &&
            Math.abs(player.x - seaMessage.x) +
            Math.abs(player.y - seaMessage.y) === 1
        ) {

            seaMessage.collected = true;
            collectedObjects.push(seaMessage.name);

            document.getElementById("inventoryText").textContent =
                collectedObjects.length + " objetos";

            currentMission = "Sigue el camino hacia las estrellas";

            document.getElementById("missionText").textContent =
                currentMission;

            showMessage(
                seaMessage.name + ": " + seaMessage.message
            );

            drawGame();
            saveGame(false);

            return true;
        }

        // Recoger conchas
        for (const shell of seaCollectibles) {

            const distance =
                Math.abs(player.x - shell.x) +
                Math.abs(player.y - shell.y);

            if (distance === 1 && !shell.collected) {

                shell.collected = true;
                collectedObjects.push(shell.name);

                const shellsCollected = seaCollectibles.filter(
                    shell => shell.collected
                ).length;

                document.getElementById("inventoryText").textContent =
                    collectedObjects.length + " objetos";

                if (shellsCollected === 3) {

                    currentMission = "Busca el mensaje del océano";

                    document.getElementById("missionText").textContent =
                        currentMission;

                    showMessage(
                        "Has reunido las tres perlas. Al unir sus fragmentos, descubres un mensaje: «No importa cuán grande sea el mar; siempre encontraré el camino hacia ti»."
                    );

                } else {

                    currentMission =
                        "Encuentra las tres perlas (" +
                        shellsCollected + "/3)";

                    document.getElementById("missionText").textContent =
                        currentMission;

                    showMessage(shell.name + ": " + shell.message);

                }

                drawGame();
                saveGame(false);

                return true;
            }

        }

        return false;
    }

    // Objetos de la montaña
    if (currentMap === "mountain") {
        const allStarsCollected = mountainCollectibles.every(
            star => star.collected
        );

    if (
        allStarsCollected &&
        !mountainMessage.collected &&
        Math.abs(player.x - mountainMessage.x) +
        Math.abs(player.y - mountainMessage.y) === 1
    ) {

        mountainMessage.collected = true;
        collectedObjects.push(mountainMessage.name);

        document.getElementById("inventoryText").textContent =
            collectedObjects.length + " objetos";

        currentMission = "Encuentra el camino hacia el destino";

        document.getElementById("missionText").textContent =
            currentMission;

        showMessage(
            mountainMessage.name + ": " + mountainMessage.message
        );

        drawGame();
        saveGame(false);

        return true;
    }

        for (const star of mountainCollectibles) {

            const distance =
                Math.abs(player.x - star.x) +
                Math.abs(player.y - star.y);

            if (distance === 1 && !star.collected) {

                star.collected = true;
                collectedObjects.push(star.name);

                const starsCollected = mountainCollectibles.filter(
                    star => star.collected
                ).length;

                document.getElementById("inventoryText").textContent =
                    collectedObjects.length + " objetos";

                if (starsCollected === 3) {

                    currentMission = "Busca el último mensaje";

                    showMessage(
                        "Has reunido los tres fragmentos. Sus luces comienzan a unirse y revelan un último camino..."
                    );

                } else {

                    currentMission =
                        "Encuentra los tres fragmentos (" +
                        starsCollected + "/3)";

                    showMessage(star.name + ": " + star.message);

                }

                document.getElementById("missionText").textContent =
                    currentMission;

                drawGame();
                saveGame(false);

                return true;
            }

        }

        return false;
    }
    
// Carta final
    if (currentMap === "final") {

        const distance =
            Math.abs(player.x - finalLetter.x) +
            Math.abs(player.y - finalLetter.y);

        if (
            finalCharacter.currentDialogue >= finalCharacter.dialogues.length &&
            distance === 1 &&
            !finalLetter.collected
        ) {

            finalLetter.collected = true;

            collectedObjects.push(finalLetter.name);

            gameCompleted = true;

            currentMission = "Aventura completada";

            document.getElementById("missionText").textContent =
                currentMission;  

            document.getElementById("inventoryText").textContent =
                collectedObjects.length + " objetos";

            currentMission = "Lee tu carta final";

            document.getElementById("missionText").textContent =
                currentMission;

            // Aplicar diseño especial a la carta final
            document.getElementById("statusMessage")
                .classList.add("final-letter-message");

            showMessage(
                finalLetter.title + ": " + finalLetter.message
            );

            drawGame();
            saveGame(false);

            return true;
        }

        return false;
    }   


    // Objetos de la aldea y del bosque
    const activeObjects = currentMap === "forest"
        ? forestObjects
        : currentMap === "village"
            ? objects
            : [];

    for (const object of activeObjects) {

        const distance =
            Math.abs(player.x - object.x) +
            Math.abs(player.y - object.y);

        if (distance === 1 && !object.collected) {

            object.collected = true;
            collectedObjects.push(object.name);

            document.getElementById("inventoryText").textContent =
                collectedObjects.length + " objetos";

            showMessage(object.name + ": " + object.message);

            if (currentMap === "village") {

                currentMission = "Dirígete hacia el bosque";

            } else if (currentMap === "forest") {

                currentMission = "Habla con la Guardiana de los Recuerdos";

            }

            missionCompleted = false;

            document.getElementById("missionText").textContent =
                currentMission;

            drawGame();
            saveGame(false);

            return true;
        }

    }

    return false;
}



// DIBUJAR EL PERSONAJE
function drawPlayer() {
    const x = player.pixelX;
    const y = player.pixelY;

    const width = 28;
    const height = 56;

    const drawX = x + 2;
    const drawY = y - 28;

    let sourceX = 63;
    let sourceY = 17;
    let sourceWidth = 144;
    let sourceHeight = 287;
    let flipHorizontal = false;

    // Determinar la pose según la dirección
    if (player.facing === "down") {
        if (player.moving && player.walkFrame === 1) {
            sourceY = 316;
            sourceHeight = 284;
        }
    }

    else if (player.facing === "right") {
        sourceX = 302;
        sourceY = 16;
        sourceWidth = 142;
        sourceHeight = 289;

        if (player.moving && player.walkFrame === 1) {
            sourceX = 301;
            sourceY = 320;
            sourceWidth = 141;
            sourceHeight = 281;
        }
    }

    else if (player.facing === "left") {
        sourceX = 302;
        sourceY = 16;
        sourceWidth = 142;
        sourceHeight = 289;

        flipHorizontal = true;

        if (player.moving && player.walkFrame === 1) {
            sourceY = 320;
            sourceHeight = 281;
        }
    }

    else if (player.facing === "up") {
        sourceX = 1018;
    }

    if (protagonistSprite.complete && protagonistSprite.naturalWidth > 0) {

    if (flipHorizontal) {
        ctx.save();
        ctx.translate(drawX + width, 0);
        ctx.scale(-1, 1);

        ctx.drawImage(
            protagonistSprite,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            0,
            drawY,
            width,
            height
        );

        ctx.restore();
    } else {
        ctx.drawImage(
            protagonistSprite,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            drawX,
            drawY,
            width,
            height
            );
        }
        }
}


function updatePlayer() {

    const speed = 0.5;

    const dx = player.targetX - player.pixelX;
    const dy = player.targetY - player.pixelY;

    if (Math.abs(dx) > speed) {
        player.pixelX += Math.sign(dx) * speed;
    } else {
        player.pixelX = player.targetX;
    }

    if (Math.abs(dy) > speed) {
        player.pixelY += Math.sign(dy) * speed;
    } else {
        player.pixelY = player.targetY;
    }

    if (
        player.pixelX === player.targetX &&
        player.pixelY === player.targetY
    ) {
        player.moving = false;
        player.walkFrame = 0;
        player.animationCounter = 0;

    } else {

        player.animationCounter++;

        if (player.animationCounter >= 6) {

            player.walkFrame = player.walkFrame === 0 ? 1 : 0;

            player.animationCounter = 0;

        }
    }
}



// DIBUJAR TODO EL ESCENARIO

function drawGame() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGround();
    drawHouses();
    drawStreetLights();
    drawVillageDecorations();
    drawTrees();
    drawMountainPines();
    drawNPCs();
    drawObjects();
    drawPlayer();
    document.getElementById("coordinates").textContent =
    "X: " + player.x + " | Y: " + player.y;

}

// COMPROBAR COLISIONES

function isBlocked(x, y) {

    // Límites del mapa
    if (
        x < 0 ||
        x >= COLS ||
        y < 0 ||
        y >= ROWS
    ) {
        return true;
    }

    // Evitar caminar sobre el agua
    if (currentMap === "sea" && y < 7) {
        return true;
    }

    // Árboles del mapa actual
    const activeTrees = currentMap === "forest"
        ? forestTrees
        : currentMap === "village"
            ? trees
            : [];

    if (activeTrees.some(([tx, ty]) => tx === x && ty === y)) {
        return true;
    }

    // Rocas y palmeras de la playa
    if (currentMap === "sea") {

        if (seaObjects.some(object => object.x === x && object.y === y)) {
            return true;
        }

    }
    // Rocas de la montaña
    if (currentMap === "mountain") {

        if (mountainObjects.some(object => object.x === x && object.y === y)) {
            return true;
        }

    }

    // Casas y personajes de la aldea
    if (currentMap === "village") {

        for (const house of houses) {

            if (
                x >= house.x &&
                x < house.x + 4 &&
                y >= house.y &&
                y < house.y + 3
            ) {
                return true;
            }

        }

        if (npcs.some(npc => npc.x === x && npc.y === y)) {
            return true;
        }

    }

    // Personajes del bosque
    if (currentMap === "forest") {

        if (forestNPCs.some(npc => npc.x === x && npc.y === y)) {
            return true;
        }

    }
    
    // Personaje del encuentro final
    if (currentMap === "final") {

        if (x === finalCharacter.x && y === finalCharacter.y) {
            return true;
        }

    }
    return false;

}

// MOVIMIENTO


function movePlayer(direction) {

    if (!gameStarted || player.moving || gameCompleted) return;

    let newX = player.x;
    let newY = player.y;

    if (direction === "up") newY--;
    if (direction === "down") newY++;
    if (direction === "left") newX--;
    if (direction === "right") newX++;

    player.facing = direction;

    if (!isBlocked(newX, newY)) {

        player.x = newX;
        player.y = newY;

        player.targetX = newX * TILE;
        player.targetY = newY * TILE;

        player.moving = true;

        saveGame(false);

        // Comprobar zonas del mapa actual
        for (const zone of zones) {

            if (
                zone.map === currentMap &&
                player.x === zone.x &&
                player.y === zone.y &&
                !zone.activated
            ) {

                // Entrada al bosque desde la aldea
                if (zone.name === "Entrada al bosque") {

    // Comprobar que recogió ambos objetos
                    if (!objects.every(object => object.collected)) {

                        showMessage(
                            "Debes recoger el Mensaje perdido y la Flor silvestre antes de continuar."
                        );

                        return;
                }

                zone.activated = true;

                currentMission = "Explora el bosque";

                document.getElementById("missionText").textContent =
                    currentMission;

                changeMap("forest", 8, 18);
            }

                // Salida del bosque hacia el mar
                else if (zone.name === "Salida hacia el mar") {

                    const guardian = forestNPCs[0];

                    const memoryFound =
                        collectedObjects.includes("Recuerdo perdido");

                    const conversationCompleted =
                        guardian.postMemoryDialogue >=
                        guardian.postMemoryDialogues.length;

                    if (memoryFound && conversationCompleted) {

                        zone.activated = true;

                        currentMission = "Explora la costa";

                        document.getElementById("missionText").textContent =
                            currentMission;

                        changeMap("sea", 15, 17);

                    } else {

                        showMessage(
                            "El camino parece continuar, pero todavía hay algo que debes descubrir en el bosque."
                        );

                    }

                }

                // Salida de la playa hacia la montaña
                else if (zone.name === "Salida hacia la montaña") {

                    if (seaMessage.collected) {

                        zone.activated = true;

                        currentMission = "Explora la montaña";

                        document.getElementById("missionText").textContent =
                            currentMission;

                        changeMap("mountain", 15, 17);

                    } else {

                        showMessage(
                            "El sendero hacia la montaña permanece oculto. Primero debes encontrar el mensaje del océano."
                        );

                    }

                }

                // Salida de la montaña hacia el destino final
                else if (zone.name === "Salida hacia el destino") {

                    if (mountainMessage.collected) {

                        zone.activated = true;

                        currentMission = "Encuentra tu destino";

                        document.getElementById("missionText").textContent =
                            currentMission;

                        changeMap("final", 15, 17);

                    } else {

                        showMessage(
                            "Todavía queda un mensaje por descubrir. Busca los tres fragmentos de estrella."
                        );

                    }

                }

            }

        }

    }

}


function changeMap(mapName, spawnX, spawnY) {

    // Comprobar que recogió los objetos de la aldea
    if (mapName === "forest") {

        const missingObjects = objects.filter(
            object => !object.collected
        );

        if (missingObjects.length > 0) {

            showMessage(
                "Antes de continuar debes recoger: " +
                missingObjects.map(object => object.name).join(" y ") +
                "."
            );

            return;
        }

        forestUnlocked = true;
    }

    currentMap = mapName;

    player.x = spawnX;
    player.y = spawnY;

    player.pixelX = spawnX * TILE;
    player.pixelY = spawnY * TILE;

    player.targetX = spawnX * TILE;
    player.targetY = spawnY * TILE;

    player.moving = false;

    drawGame();

    saveGame(false);

    if (mapName === "forest") {

        showMessage(
            "Bosque de los Recuerdos: Un nuevo camino comienza aquí. ¿Qué secretos guardará este lugar?"
        );

    } else if (mapName === "sea") {

        currentMission = "Encuentra las tres perlas";

        document.getElementById("missionText").textContent =
            currentMission;

        showMessage(
            "The Sea of Distance: El sonido de las olas acompaña tus pasos. Tres perlas parecen esconder algo especial..."
        );

    }
    else if (mapName === "mountain") {

        showMessage(
            "The Mountain of Stars: Has llegado a un lugar donde el cielo parece estar más cerca que nunca. Entre las estrellas encontrarás el último fragmento de este viaje."
        );

    }

}

// CONTROLES DE TECLADO
document.addEventListener("keydown", event => {

    const key = event.key.toLowerCase();

    const directions = {
        arrowup: "up",
        w: "up",
        arrowdown: "down",
        s: "down",
        arrowleft: "left",
        a: "left",
        arrowright: "right",
        d: "right"
    };

    if (directions[key]) {
        event.preventDefault();
        movePlayer(directions[key]);
    }

    if (key === "e" || key === " ") {
        event.preventDefault();

        if (gameCompleted) {
            finishGame();
            return;
        }

        if (gameStarted) {
            interactWithNPC();
        }
    }

});



// CONTROLES TÁCTILES

document.querySelectorAll("[data-move]").forEach(button => {

    button.addEventListener("click", () => {

        movePlayer(button.dataset.move);

    });

});

const interactButton = document.getElementById("interactButton");

interactButton.addEventListener("click", () => {

    if (gameCompleted) {
        finishGame();
        return;
    }

    if (gameStarted) {
        interactWithNPC();
    }

});

// MENSAJES

function showMessage(message) {

    const status = document.getElementById("statusMessage");
    const name = document.getElementById("dialogueName");
    const text = document.getElementById("dialogueText");

    const separator = message.indexOf(":");

    if (separator !== -1) {
        name.textContent = message.substring(0, separator);
        text.textContent = message.substring(separator + 1).trim();
    } else {
        name.textContent = "";
        text.textContent = message;
    }

    status.style.display = "block";
}


// FINALIZAR EL JUEGO DESPUÉS DE LEER LA CARTA

function finishGame() {

    const status = document.getElementById("statusMessage");
    const ending = document.getElementById("endingScreen");

    status.style.display = "none";
    ending.style.display = "flex";

    // Crear corazones flotantes una sola vez
    if (!ending.querySelector(".floating-heart")) {

        const positions = [8, 18, 30, 42, 55, 67, 79, 91];

        positions.forEach((position, index) => {

            const heart = document.createElement("span");

            heart.className = "floating-heart";
            heart.textContent = "♥";
            heart.style.left = position + "%";
            heart.style.animationDelay = (index * 0.8) + "s";
            heart.style.fontSize = (16 + index % 3 * 5) + "px";

            ending.appendChild(heart);

        });

    }

}


function interactWithNPC() {

    if (interactWithObject()) {
        return;
    }
    // Encuentro final
    if (currentMap === "final") {

        const distance =
            Math.abs(player.x - finalCharacter.x) +
            Math.abs(player.y - finalCharacter.y);

        if (distance === 1) {

            if (
                finalCharacter.currentDialogue <
                finalCharacter.dialogues.length
            ) {

                showMessage(
                    finalCharacter.name + ": " +
                    finalCharacter.dialogues[
                        finalCharacter.currentDialogue
                    ]
                );

                finalCharacter.currentDialogue++;

            } else {

                showMessage(
                    "Y después de tanto caminar, por fin ya no hay distancia entre nosotros."
                );

            }

            return;
        }

    }

    const activeNPCs = currentMap === "forest"
        ? forestNPCs
        : npcs;

    for (const npc of activeNPCs) {

        const distance =
            Math.abs(player.x - npc.x) +
            Math.abs(player.y - npc.y);

        if (distance === 1) {

            // Diálogos especiales de la Guardiana
            if (currentMap === "forest") {

                const memoryFound =
                    collectedObjects.includes("Recuerdo perdido");

                if (memoryFound) {

                    if (npc.postMemoryDialogue < npc.postMemoryDialogues.length) {

                        showMessage(
                            npc.name + ": " +
                            npc.postMemoryDialogues[npc.postMemoryDialogue]
                        );

                        npc.postMemoryDialogue++;

                    } else {

                        showMessage(
                            npc.name + ": El camino hacia el mar te espera."
                        );

                    }

                } else {

                    if (npc.currentDialogue < npc.dialogues.length) {

                        showMessage(
                            npc.name + ": " +
                            npc.dialogues[npc.currentDialogue]
                        );

                        npc.currentDialogue++;

                    } else {

                        showMessage(npc.name + " guarda silencio.");

                    }

                }

                return;
            }

            // Diálogos de los personajes de la aldea
            if (npc.currentDialogue < npc.dialogues.length) {

                showMessage(
                    npc.name + ": " + npc.dialogues[npc.currentDialogue]
                );

                npc.currentDialogue++;

                if (
                    npc.name === "Viajero" &&
                    npc.currentDialogue === npc.dialogues.length &&
                    !missionCompleted
                ) {

                    missionCompleted = true;

                    currentMission = "Busca el mensaje perdido";

                    document.getElementById("missionText").textContent =
                        currentMission;
                }

            } else {

                showMessage(npc.name + " guarda silencio.");

            }

            return;
        }
    }

    showMessage("No hay nadie cerca con quien hablar.");
}



// SISTEMA DE GUARDADO

function saveGame(showFeedback = true) {

    const saveData = {
        x: player.x,
        y: player.y,
        facing: player.facing,
        chapter: 1,
        collectedObjects: collectedObjects,
        objects: objects,
        forestObjects: forestObjects,
        seaCollectibles: seaCollectibles,
        seaMessage: seaMessage,
        mountainCollectibles: mountainCollectibles,
        mountainMessage: mountainMessage,
        finalCharacterDialogue: finalCharacter.currentDialogue,
        finalLetter: finalLetter,
        currentMission: currentMission,
        missionCompleted: missionCompleted,
        gameCompleted: gameCompleted,
        map: currentMap,
        forestUnlocked: forestUnlocked,
        gameCompleted: gameCompleted
    };

    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(saveData)
    );

    updateContinueButton();

    if (showFeedback) {
        showMessage("Tu progreso ha sido guardado.");
    }

}

function loadGame() {

    const savedData = localStorage.getItem(SAVE_KEY);

    if (!savedData) return false;

    try {

        const data = JSON.parse(savedData);

        if (
            !Number.isInteger(data.x) ||
            !Number.isInteger(data.y) ||
            isBlocked(data.x, data.y)
        ) {
            return false;
        }

        player.x = data.x;
        player.y = data.y;
        player.facing = data.facing || "down";

        // Sincronizar posición visual
        player.pixelX = data.x * TILE;
        player.pixelY = data.y * TILE;

        player.targetX = data.x * TILE;
        player.targetY = data.y * TILE;

        player.moving = false;

        // Recuperar inventario
        collectedObjects = Array.isArray(data.collectedObjects)
            ? data.collectedObjects
            : [];

        // Recuperar objetos recogidos
        if (Array.isArray(data.objects)) {
            for (const object of objects) {
                const savedObject = data.objects.find(
                    item => item.name === object.name
                );

                if (savedObject) {
                    object.collected = savedObject.collected;
                }
            }
        }
        // Recuperar conchas de la playa
        if (Array.isArray(data.seaCollectibles)) {

            for (const shell of seaCollectibles) {

                const savedShell = data.seaCollectibles.find(
                    item => item.name === shell.name
                );

                if (savedShell) {
                    shell.collected = savedShell.collected;
                }

            }

        }

        // Recuperar mensaje del océano
        if (data.seaMessage) {

            seaMessage.collected = data.seaMessage.collected || false;

        }
        // Recuperar fragmentos de estrella
        if (Array.isArray(data.mountainCollectibles)) {

            for (const star of mountainCollectibles) {

                const savedStar = data.mountainCollectibles.find(
                    item => item.name === star.name
                );

                if (savedStar) {
                    star.collected = savedStar.collected;
                }

            }

        }

        // Recuperar último mensaje de la montaña
        if (data.mountainMessage) {

            mountainMessage.collected =
                data.mountainMessage.collected || false;

        }
        
        // Recuperar diálogo del encuentro final
        if (Number.isInteger(data.finalCharacterDialogue)) {

            finalCharacter.currentDialogue =
                data.finalCharacterDialogue;

        }

        // Recuperar carta final
        if (data.finalLetter) {

            finalLetter.collected =
                data.finalLetter.collected || false;

        }


        // Recuperar objetos del bosque
        if (Array.isArray(data.forestObjects)) {
            for (const object of forestObjects) {
                const savedObject = data.forestObjects.find(
                    item => item.name === object.name
                );

                if (savedObject) {
                    object.collected = savedObject.collected;
                }
             }
        }

        // Recuperar misión
        currentMission = data.currentMission || currentMission;
        missionCompleted = data.missionCompleted || false;
        currentMap = data.map || "village";
        forestUnlocked = data.forestUnlocked || false;
        gameCompleted = data.gameCompleted || false;

// Mostrar la pantalla final si la aventura ya terminó
        if (gameCompleted) {
            document.getElementById("endingScreen").style.display = "flex";
        }

        document.getElementById("missionText").textContent = currentMission;

        document.getElementById("inventoryText").textContent =
            collectedObjects.length + " objetos";

        drawGame();

        return true;

    } catch (error) {

        return false;

    }

}

// ACTUALIZAR BOTÓN CONTINUAR

function updateContinueButton() {

    const savedData = localStorage.getItem(SAVE_KEY);

    document.getElementById("continueButton").disabled =
        !savedData;

}

// INICIAR PARTIDA

function startGame(continuePrevious = false) {

    if (continuePrevious) {

        if (!loadGame()) {
            showMessage("No se pudo cargar la partida.");
            return;
        }

    } else {

        player.x = 4;
        player.y = 10;
        player.facing = "down";
        player.pixelX = player.x * TILE;
        player.pixelY = player.y * TILE;

        player.targetX = player.pixelX;
        player.targetY = player.pixelY;

        player.moving = false;

        saveGame(false);

    }

    gameStarted = true;

    document.getElementById("startScreen").style.display = "none";

    drawGame();

}

// BOTONES DEL MENÚ

document.getElementById("newGameButton").addEventListener("click", () => {

    startGame(false);

});

document.getElementById("continueButton").addEventListener("click", () => {

    startGame(true);

});

document.getElementById("saveButton").addEventListener("click", () => {

    if (gameStarted) {
        saveGame(true);
    }

});

// INICIALIZACIÓN

function gameLoop() {

    updatePlayer();

    drawGame();

    requestAnimationFrame(gameLoop);
}

updateContinueButton();
gameLoop();

// Botón para entrar desde la portada
document.getElementById("playButton").addEventListener("click", () => {

    // Ocultar la portada
    document.getElementById("coverScreen").style.display = "none";

    // Reproducir música de fondo
    const music = document.getElementById("backgroundMusic");

    music.volume = 0.25;
    music.play().catch(error => {
        console.log("No se pudo reproducir la música:", error);
    });

});
