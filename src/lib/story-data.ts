export interface MiniStory {
  part: number;
  emojis: string;
  text: string;
  illustration: string;
}

export interface StoryChapter {
  chapter: number;
  title: string;
  stories: MiniStory[];
}

export const LILY_STORY_CHAPTERS: StoryChapter[] = [
  {
    chapter: 1,
    title: "El Brillo Perdido",
    stories: [
      {
        part: 1,
        emojis: '👧🌸🏡✨',
        text: 'Lily vivía en un pueblo conocido por su jardín mágico, donde las flores brillaban como estrellas.',
        illustration: 'Una niña sonriente con coletas castañas y un vestido azul claro, de pie junto a un pequeño jardín lleno de flores de colores pastel que emiten un suave brillo. El estilo es de dibujos animados, con colores suaves y un ambiente de atardecer mágico.'
      },
      {
        part: 2,
        emojis: '👵❤️🎁🌸',
        text: 'Su abuela le había regalado una flor muy especial, una pequeña luz que guardaba en su habitación.',
        illustration: 'Una anciana amable con gafas y pelo blanco entrega una pequeña maceta con una única flor brillante a Lily. La niña mira la flor con asombro y alegría. La escena es cálida y acogedora, dentro de una casa de campo.'
      },
      {
        part: 3,
        emojis: '🛏️🌸😴💭',
        text: 'Cada noche, Lily dormía con el suave resplandor de su flor, soñando con jardines de estrellas.',
        illustration: 'Lily durmiendo plácidamente en su cama. A su lado, en la mesita de noche, la flor mágica ilumina la habitación con una luz suave y dorada. El ambiente es tranquilo y sereno, con una paleta de colores nocturnos y suaves.'
      },
      {
        part: 4,
        emojis: '⛈️🌬️💨🌳',
        text: 'Pero una noche, una fuerte tormenta sacudió el pueblo con vientos y lluvias furiosas.',
        illustration: 'Vista exterior de la casa de Lily durante una noche de tormenta. Rayos iluminan el cielo oscuro, el viento dobla los árboles y la lluvia cae con fuerza. El estilo es caricaturesco pero con un tono dramático.'
      },
      {
        part: 5,
        emojis: '😱💨🌸💥',
        text: 'Una ráfaga de viento abrió la ventana y derribó la pequeña maceta de Lily.',
        illustration: 'Interior de la habitación de Lily. La ventana está abierta de golpe por el viento, y la pequeña maceta con la flor está cayendo al suelo. La expresión de Lily es de sorpresa y miedo. Estilo de dibujos animados, colores pastel.'
      },
      {
        part: 6,
        emojis: '😭💔🌸⬛',
        text: 'Cuando la tormenta pasó, Lily recogió su flor. Su luz se había apagado y sus pétalos estaban grises.',
        illustration: 'Lily arrodillada en el suelo de su habitación, sosteniendo la pequeña flor marchita y gris con ambas manos. Una lágrima cae por su mejilla. La luz de la mañana entra por la ventana, iluminando su expresión triste.'
      },
      {
        part: 7,
        emojis: '😔 windowsill 🥀',
        text: 'Puso la flor marchita en la ventana, esperando que el sol le devolviera su magia.',
        illustration: 'Un primer plano de la flor gris y marchita en su maceta, colocada en el alféizar de una ventana. Afuera, el sol brilla, pero la flor permanece sin vida. Estilo suave y melancólico.'
      },
      {
        part: 8,
        emojis: '☀️❓🌸⬛',
        text: 'Pero pasaron los días y la flor no recuperaba su brillo. El corazón de Lily estaba triste.',
        illustration: 'Secuencia de tres pequeños paneles. El primero muestra el sol, el segundo una luna, y el tercero el sol de nuevo, todos sobre la flor marchita que no cambia. La paleta de colores es suave, enfatizando el paso del tiempo.'
      },
      {
        part: 9,
        emojis: '🌳🚶‍♀️👴HELLO',
        text: 'Caminando por el jardín del pueblo, ahora dañado por la tormenta, se encontró con el viejo jardinero.',
        illustration: 'Lily, con la cabeza gacha, camina por un sendero del jardín del pueblo. Hay ramas rotas y flores caídas por todas partes. Un anciano con un sombrero de paja y un delantal de jardinería la saluda amablemente.'
      },
      {
        part: 10,
        emojis: '👴🗣️📖✨',
        text: 'El jardinero, al ver su tristeza, le contó una antigua leyenda sobre las flores del arcoíris.',
        illustration: 'El anciano jardinero sentado en un banco de madera junto a Lily. Él le muestra un viejo libro abierto con dibujos de flores de colores y una semilla brillante. La expresión de Lily cambia de tristeza a curiosidad.'
      }
    ]
  },
  {
    chapter: 2,
    title: "La Semilla de Luz Estelar",
    stories: [
      {
        part: 1,
        emojis: '🌈🌸🌱➡️🌟',
        text: '"Si fusionas las siete flores del arcoíris", dijo, "crearás una Semilla de Luz Estelar".',
        illustration: 'Una ilustración de estilo fantástico dentro de un borde de página de libro. Muestra siete flores de colores del arcoíris fusionándose en una sola semilla que brilla intensamente. Estilo de dibujo de cuento de hadas.'
      },
      {
        part: 2,
        emojis: '🌟+🌸⬛=🌸✨',
        text: 'Esa semilla, decía la leyenda, podría devolver la vida a cualquier flor mágica.',
        illustration: 'Dos paneles. En el primero, una mano deja caer la semilla brillante sobre una flor gris. En el segundo, la misma flor ahora brilla con una luz radiante. Estilo simple y claro, como un diagrama mágico.'
      },
      {
        part: 3,
        emojis: '🤔❓💪🏁',
        text: 'Lily se preguntó si podría lograr una hazaña tan grande. ¡Decidió que lo intentaría!',
        illustration: 'Lily de pie, mirando con determinación un camino que se adentra en el jardín. Sostiene una pequeña pala de jardinería. Su sombra se proyecta larga detrás de ella, y su rostro muestra una nueva resolución.'
      },
      {
        part: 4,
        emojis: '🎒🗺️🌱➡️',
        text: 'Preparó una pequeña mochila, un mapa del jardín que el jardinero le dibujó y sus herramientas.',
        illustration: 'Mesa de madera con varios objetos de aventura dispuestos ordenadamente: una pequeña mochila de tela, un mapa de papel enrollado, guantes de jardinería y una regadera. La luz del sol ilumina la escena.'
      },
      {
        part: 5,
        emojis: '🌱🔴1️⃣🌷',
        text: 'Su primera tarea: encontrar y cultivar la Flor Roja, que crecía cerca del viejo molino.',
        illustration: 'Lily plantando cuidadosamente una pequeña semilla roja en un claro cerca de un viejo molino de viento de madera. El cielo es azul claro y el ambiente es optimista y brillante.'
      },
      {
        part: 6,
        emojis: '💧☀️🌱❤️',
        text: 'La regaba cada día, la protegía del viento y le hablaba con cariño.',
        illustration: 'Montaje de tres escenas pequeñas: Lily regando la planta, Lily construyendo un pequeño cortavientos de piedras, y Lily susurrándole a la planta. El estilo es suave y tierno.'
      },
      {
        part: 7,
        emojis: '⏳...🌱...🌷!',
        text: 'Poco a poco, un brote se convirtió en una hermosa y vibrante flor roja.',
        illustration: 'Una secuencia de lapso de tiempo que muestra el crecimiento de la flor roja, desde un pequeño brote verde hasta una flor completamente abierta y brillante. El color rojo es especialmente vívido.'
      },
      {
        part: 8,
        emojis: '😊🔴🌷🧺',
        text: '¡Lo había logrado! Con mucho cuidado, colocó su primera flor en su canasta.',
        illustration: 'Lily sonriendo con orgullo mientras coloca con delicadeza la flor roja en una cesta de mimbre. El sol brilla sobre ella, resaltando su alegría.'
      },
      {
        part: 9,
        emojis: '🗺️➡️🟠-river',
        text: 'Ahora, el mapa la guiaba hacia la Flor Naranja, que crecía a la orilla del arroyo brillante.',
        illustration: 'Lily consultando su mapa. Una línea de puntos en el mapa va desde el molino hasta un río. El fondo muestra un sendero que se dirige hacia un arroyo resplandeciente.'
      },
      {
        part: 10,
        emojis: '🦋👋✨',
        text: 'En el camino, una mariposa de alas brillantes pareció saludarla y guiarla.',
        illustration: 'Una hermosa mariposa con alas que brillan con motas de luz revolotea justo delante de la cara de Lily. Lily la mira con asombro y una sonrisa.'
      }
    ]
  },
  {
    chapter: 3,
    title: "El Arroyo Melodioso",
    stories: [
      {
        part: 1,
        emojis: '🌊🎶💧🟠',
        text: 'El arroyo cantaba una melodía mientras sus aguas reflejaban el cielo. Allí estaba, la Flor Naranja.',
        illustration: 'Un arroyo tranquilo fluyendo sobre piedras lisas. En la orilla, entre la hierba verde, crece una solitaria y brillante flor naranja. El agua refleja los colores del atardecer.'
      },
      {
        part: 2,
        emojis: '🐸⛔️🌱',
        text: 'Pero un coro de ranas gruñonas no la dejaba acercarse a la flor.',
        illustration: 'Un grupo de ranas de dibujos animados, con el ceño fruncido y los brazos cruzados, sentadas en círculo alrededor de la flor naranja, bloqueando el paso a Lily.'
      },
      {
        part: 3,
        emojis: '🤔🎶🎸(🌿)',
        text: 'Lily recordó una canción que su abuela le cantaba. Hizo una pequeña flauta con una caña.',
        illustration: 'Lily sentada bajo un árbol, tallando cuidadosamente una pequeña flauta con una navaja de juguete de un trozo de caña hueca. Su expresión es concentrada.'
      },
      {
        part: 4,
        emojis: '🎶➡️🐸😊',
        text: 'Tocó una melodía suave y dulce. Las ranas, sorprendidas, dejaron de gruñir y escucharon.',
        illustration: 'Lily tocando su flauta de caña. Las ranas ahora tienen expresiones felices y curiosas, y algunas se balancean al ritmo de la música. Notas musicales flotan en el aire.'
      },
      {
        part: 5,
        emojis: '🐸➡️🎁💧',
        text: 'Agradecidas, las ranas le ofrecieron una gota de rocío brillante para ayudar a la flor.',
        illustration: 'La rana más grande le ofrece a Lily una hoja que contiene una única y gran gota de rocío que brilla con luz propia. Lily la acepta con gratitud.'
      },
      {
        part: 6,
        emojis: '💧+🟠=🍊✨',
        text: 'Lily regó la Flor Naranja con la gota mágica, y esta brilló con una luz cálida y amigable.',
        illustration: 'La flor naranja, ahora con un aura brillante, parece más grande y saludable. Pequeñas partículas de luz flotan a su alrededor.'
      },
      {
        part: 7,
        emojis: '🧺+🟠🌷',
        text: 'Con su segunda flor a salvo, se despidió de sus nuevos amigos anfibios.',
        illustration: 'Lily agitando la mano para despedirse de las ranas, que le devuelven el saludo desde la orilla del arroyo. Ahora tiene dos flores en su canasta: una roja y una naranja.'
      },
      {
        part: 8,
        emojis: '🗺️➡️🟡-field',
        text: 'El siguiente destino: el Campo de Girasoles, donde encontraría la Flor Amarilla.',
        illustration: 'Primer plano del mapa, con el dedo de Lily señalando un dibujo de un campo de girasoles. El sol está dibujado en la esquina del mapa, sonriendo.'
      },
      {
        part: 9,
        emojis: '🌻🌻🌻🚶‍♀️🌻🌻',
        text: 'Se adentró en un mar de girasoles que eran más altos que ella.',
        illustration: 'Lily caminando por un sendero estrecho en medio de un campo de girasoles gigantes. Solo se ve su cabeza y la parte superior de su cuerpo entre las enormes flores amarillas.'
      },
      {
        part: 10,
        emojis: '😴💤🌻🛏️',
        text: 'El sol era cálido y el zumbido de las abejas la arrullaba. Se quedó dormida bajo un girasol.',
        illustration: 'Lily durmiendo una siesta, acurrucada en la base de un girasol gigante. Su expresión es pacífica. Una abeja de dibujos animados regordeta y amigable la mira con curiosidad.'
      }
    ]
  },
  {
    chapter: 4,
    title: "El Secreto del Girasol",
    stories: [
      {
        part: 1,
        emojis: '☀️😴...❓',
        text: 'Cuando Lily despertó, el sol se estaba poniendo. ¡Estaba perdida en el campo de girasoles!',
        illustration: 'Lily despertando, frotándose los ojos. El cielo es de color naranja y morado. A su alrededor, los girasoles crean un laberinto de tallos altos.'
      },
      {
        part: 2,
        emojis: '😨🌻🔄🌻',
        text: 'Todos los girasoles se veían iguales. Caminó en círculos, sintiendo un poco de miedo.',
        illustration: 'Vista desde arriba de Lily, pequeña en medio del campo de girasoles. Un camino punteado muestra que ha estado caminando en círculos. Su postura es de preocupación.'
      },
      {
        part: 3,
        emojis: '🐝✨🎶➡️',
        text: 'Entonces, la pequeña abeja que vio antes apareció, zumbando una melodía y dejando un rastro brillante.',
        illustration: 'La misma abeja amigable de antes ahora tiene un rastro de polvo dorado brillante detrás de ella. Vuela delante de Lily, como invitándola a seguirla.'
      },
      {
        part: 4,
        emojis: '🚶‍♀️✨➡️🌻👑',
        text: 'La abeja la guió a un claro en el centro del campo, donde crecía un girasol gigante con una corona.',
        illustration: 'Un enorme girasol, que parece un rey, se alza en el centro de un claro. En su centro, en lugar de semillas, hay un remolino de luz dorada. La Flor Amarilla está en su base.'
      },
      {
        part: 5,
        emojis: '👑🌻...🌱🟡',
        text: 'El Rey Girasol se inclinó suavemente y de su centro cayó la semilla de la Flor Amarilla.',
        illustration: 'El girasol gigante se inclina. Una sola semilla amarilla y brillante cae de su centro y aterriza suavemente en la mano extendida de Lily.'
      },
      {
        part: 6,
        emojis: '🌱+💧=🌼',
        text: 'Lily plantó la semilla y, con un poco de agua, creció instantáneamente en una hermosa flor amarilla.',
        illustration: 'La flor amarilla brota mágicamente del suelo, desplegando sus pétalos en un instante. El estilo visual es rápido y lleno de destellos de luz.'
      },
      {
        part: 7,
        emojis: '🧺+🌼😊',
        text: '¡Tres flores! Su canasta se veía cada vez más colorida. Agradeció a la abeja y al Rey Girasol.',
        illustration: 'Lily mirando felizmente su canasta, que ahora contiene flores rojas, naranjas y amarillas. La abeja vuela alrededor de su cabeza y el Rey Girasol parece sonreír.'
      },
      {
        part: 8,
        emojis: '🗺️➡️🌳-forest',
        text: 'El siguiente lugar era el Bosque Susurrante, hogar de la Flor Verde.',
        illustration: 'Lily mirando su mapa. Su dedo ahora apunta a un área densamente dibujada con árboles. El nombre "Bosque Susurrante" está escrito con letras curvas y elegantes.'
      },
      {
        part: 9,
        emojis: '🌳🌳🚶‍♀️🌳🌳',
        text: 'Los árboles del bosque eran viejos y sabios, y sus hojas susurraban secretos con el viento.',
        illustration: 'Lily entrando en un bosque antiguo. Los árboles tienen caras amigables y nudosas talladas en sus troncos. La luz del sol se filtra a través de las hojas, creando patrones en el suelo.'
      },
      {
        part: 10,
        emojis: '🐿️🌰👋',
        text: 'Una pequeña ardilla con una bellota más grande que su cabeza la saludó desde una rama.',
        illustration: 'Una ardilla de dibujos animados, muy linda y esponjosa, luchando por sostener una bellota cómicamente grande. Saluda a Lily con una de sus patitas.'
      }
    ]
  },
  {
    chapter: 5,
    title: "El Bosque Susurrante",
    stories: [
      {
        part: 1,
        emojis: '🌳🤫🌳🍀',
        text: 'El bosque estaba lleno de vida. En un claro cubierto de musgo, encontró la Flor Verde.',
        illustration: 'Un claro sereno en el bosque. La luz del sol ilumina un parche de musgo verde brillante, donde crece una delicada flor verde con forma de trébol.'
      },
      {
        part: 2,
        emojis: '👻(búho)⛔️🍀',
        text: 'Pero un viejo búho sabio, guardián de la flor, le dijo que debía resolver un acertijo primero.',
        illustration: 'Un búho grande y de aspecto inteligente, con gafas de lectura en la punta de su pico, está posado en una rama sobre la flor. Tiene un ala extendida, bloqueando el paso.'
      },
      {
        part: 3,
        emojis: '🦉❓"⬆️-root, ⬇️-sky"',
        text: '"Tengo raíces que nadie ve, soy más alto que los árboles, subo y subo pero nunca crezco. ¿Qué soy?"',
        illustration: 'Un bocadillo de diálogo sale del búho, conteniendo un gran signo de interrogación. Lily se sienta en una roca, pensativa, con un dedo en la barbilla.'
      },
      {
        part: 4,
        emojis: '🤔...💡...⛰️!',
        text: 'Lily pensó y pensó. Miró a lo lejos, más allá de los árboles, y vio la solución.',
        illustration: 'Los ojos de Lily se abren de par en par con una idea. A lo lejos, a través de un hueco en los árboles, se ve el pico de una montaña majestuosa.'
      },
      {
        part: 5,
        emojis: '🗣️"¡Una montaña!"',
        text: '"¡Es una montaña!", exclamó Lily. El búho ululó con aprobación.',
        illustration: 'Lily señalando con confianza. El búho sonríe (tanto como un búho puede sonreír) y asiente, con los ojos cerrados en señal de aprobación.'
      },
      {
        part: 6,
        emojis: '🦉🎁깃털🍀',
        text: 'Como recompensa por su ingenio, el búho le dio una pluma suave para acariciar la flor.',
        illustration: 'El búho deja caer una pluma verde y suave, que flota lentamente hasta la mano de Lily. La pluma brilla débilmente.'
      },
      {
        part: 7,
        emojis: '🪶+🍀=☘️✨',
        text: 'Al tocar la flor con la pluma, esta se abrió revelando un trébol de cuatro hojas en su centro.',
        illustration: 'Primer plano de la flor verde. Mientras la pluma la toca, sus pétalos se abren para mostrar un brillante trébol de cuatro hojas en el centro, que emite una luz verde.'
      },
      {
        part: 8,
        emojis: '🧺+☘️😊',
        text: 'Lily añadió la Flor Verde a su canasta. ¡Ya tenía cuatro! Estaba a mitad de camino.',
        illustration: 'Lily sonriendo mientras mira su canasta, ahora con cuatro flores de colores. Se siente orgullosa y esperanzada.'
      },
      {
        part: 9,
        emojis: '🗺️➡️🏞️-lake',
        text: 'El mapa la llevó fuera del bosque hacia el Lago de los Reflejos, donde buscaría la Flor Azul.',
        illustration: 'Lily saliendo del bosque hacia la luz. A lo lejos, se ve un gran lago azul que brilla bajo el sol. El mapa en su mano muestra una gran mancha azul.'
      },
      {
        part: 10,
        emojis: '🏞️💧💎',
        text: 'El lago era tan claro y tranquilo que parecía un espejo gigante que reflejaba el cielo.',
        illustration: 'Una vista panorámica de un lago perfectamente tranquilo. Las nubes y el cielo azul se reflejan en su superficie sin una sola onda, creando una imagen simétrica y hermosa.'
      }
    ]
  },
  {
    chapter: 6,
    title: "El Lago de los Reflejos",
    stories: [
      {
        part: 1,
        emojis: '🏞️...❓...💧-center',
        text: 'Lily buscó por toda la orilla, pero no encontró la flor. Luego vio algo en el centro del lago.',
        illustration: 'Lily en la orilla del lago, mirando hacia el centro con la mano sobre los ojos. En el medio del lago, hay una pequeña isla rocosa con un punto azul brillante.'
      },
      {
        part: 2,
        emojis: '🐢💤-shore',
        text: 'En la orilla, una vieja tortuga dormitaba al sol. Era tan grande que parecía una roca.',
        illustration: 'Una tortuga gigante y de aspecto muy antiguo durmiendo en la arena. Su caparazón está cubierto de musgo y pequeñas plantas, pareciendo parte del paisaje.'
      },
      {
        part: 3,
        emojis: '👋🐢...👀',
        text: 'Lily la saludó con cuidado. La tortuga abrió un ojo lentamente, tan sabio y antiguo como el lago.',
        illustration: 'Primer plano de la cabeza de la tortuga. Abre un ojo arrugado y mira a Lily con una expresión tranquila y sabia. Lily está a un lado, pareciendo muy pequeña en comparación.'
      },
      {
        part: 4,
        emojis: '🗣️🌸...🐢➡️🏞️',
        text: 'Lily le explicó su búsqueda. La tortuga asintió y se deslizó lentamente hacia el agua.',
        illustration: 'La tortuga asiente con la cabeza y luego se mueve hacia el lago, invitando a Lily a subir a su caparazón con un movimiento de cabeza.'
      },
      {
        part: 5,
        emojis: '👧-on-🐢-back➡️🏝️',
        text: '¡Se ofreció a llevarla! Lily se subió a su gran caparazón y navegaron hacia la isla.',
        illustration: 'Lily sentada en el enorme caparazón de la tortuga mientras nadan tranquilamente por el lago. Lily mira a su alrededor con asombro. Su reflejo se ve en el agua.'
      },
      {
        part: 6,
        emojis: '🏝️💧💎🌸',
        text: 'En la pequeña isla rocosa, encontró la Flor Azul, que brillaba como un zafiro.',
        illustration: 'En una pequeña isla rocosa, una flor azul cristalina crece en una grieta. Sus pétalos parecen hechos de cristal y reflejan la luz del sol en destellos azules.'
      },
      {
        part: 7,
        emojis: '🐢🎁🐚',
        text: 'La tortuga le dio una pequeña concha iridiscente para recoger la flor sin dañarla.',
        illustration: 'La tortuga le ofrece a Lily una hermosa concha que brilla con los colores del arcoíris. Lily la toma con cuidado.'
      },
      {
        part: 8,
        emojis: '🧺+💎🌸😊',
        text: 'Con la Flor Azul en su canasta, Lily se sintió más cerca de su meta.',
        illustration: 'Lily de vuelta en la orilla, despidiéndose de la tortuga. Su canasta ahora tiene cinco flores, creando un pequeño arcoíris.'
      },
      {
        part: 9,
        emojis: '🗺️➡️🌌-caves',
        text: 'El siguiente desafío: las Cuevas de Eco, para encontrar la Flor Índigo.',
        illustration: 'El mapa ahora muestra la entrada a una cueva. El dibujo está coloreado con tonos oscuros de azul y morado, y pequeñas estrellas están dibujadas a su alrededor.'
      },
      {
        part: 10,
        emojis: '🦇🦇🦇-entrance',
        text: 'La entrada a la cueva estaba oscura y un poco intimidante. Unos murciélagos amigables salieron volando.',
        illustration: 'La entrada oscura de una cueva. Unos pocos murciélagos de dibujos animados con grandes ojos y pequeñas sonrisas salen volando, sin parecer amenazantes.'
      }
    ]
  },
  {
    chapter: 7,
    title: "La Cueva de los Ecos",
    stories: [
      {
        part: 1,
        emojis: '🔦🚶‍♀️🌌',
        text: 'Lily encendió una pequeña linterna de luciérnaga que el jardinero le había dado y entró.',
        illustration: 'Lily entrando en la cueva oscura. Sostiene un pequeño frasco que contiene una luciérnaga brillante, que ilumina el camino justo delante de ella.'
      },
      {
        part: 2,
        emojis: '🗣️"hola" ... "hola...ola...la..."',
        text: 'Cada sonido que hacía, la cueva se lo devolvía en un susurro. ¡Era una cueva de ecos!',
        illustration: 'Lily dice "Hola" y las palabras "Hola... ola... la..." se ven escritas en el aire, cada vez más pequeñas y desvaneciéndose en la oscuridad de la cueva.'
      },
      {
        part: 3,
        emojis: '💎💎💎-walls',
        text: 'Las paredes de la cueva estaban cubiertas de cristales que brillaban con la luz de su linterna.',
        illustration: 'La luz de la linterna de luciérnaga de Lily ilumina las paredes de la cueva, revelando que están incrustadas con miles de cristales de colores que brillan y centellean.'
      },
      {
        part: 4,
        emojis: '🎶...❓...💧',
        text: 'Escuchó una música suave, como gotas de agua cantando. Siguió el sonido.',
        illustration: 'Notas musicales hechas de gotas de agua flotan en el aire desde una parte más profunda de la cueva. Lily sigue el rastro musical con curiosidad.'
      },
      {
        part: 5,
        emojis: '🌌-chamber...💧🎶-stalactites',
        text: 'Llegó a una gran cámara donde el agua goteaba de las estalactitas, creando una melodía mágica.',
        illustration: 'Una vasta cámara subterránea. El agua gotea de las puntas de las estalactitas, cayendo sobre cristales de diferentes tamaños y produciendo una música visible como ondas de color.'
      },
      {
        part: 6,
        emojis: '💧🎶➡️🌸-indigo',
        text: 'En el centro de la cámara, nutrida por esta música, crecía la Flor Índigo.',
        illustration: 'En el centro de la cámara, rodeada por los cristales musicales, crece una flor de color índigo profundo. La flor parece vibrar suavemente con la música.'
      },
      {
        part: 7,
        emojis: '🎶+🌸=🌌✨',
        text: 'Lily cantó junto con la cueva. Su voz se unió a la melodía, y la flor brilló aún más.',
        illustration: 'Lily cantando con los ojos cerrados. Su voz se visualiza como una onda de luz plateada que se entrelaza con las ondas de color de la cueva y envuelve la flor índigo.'
      },
      {
        part: 8,
        emojis: '🧺+🌌🌸😊',
        text: 'Con la sexta flor, su canasta estaba casi llena. ¡Solo faltaba una!',
        illustration: 'Lily saliendo de la cueva hacia la luz del día, sonriendo. Mira su canasta, que ahora está llena de un arcoíris de flores. Se ve muy orgullosa.'
      },
      {
        part: 9,
        emojis: '🗺️➡️⛰️-peak',
        text: 'El último lugar: la Cima de la Montaña Solitaria, hogar de la Flor Violeta.',
        illustration: 'El mapa muestra una única montaña alta que se eleva sobre todo lo demás. En la cima, hay dibujada una pequeña flor violeta.'
      },
      {
        part: 10,
        emojis: '🧗‍♀️⛰️...🌬️🥶',
        text: 'La subida era empinada y el viento soplaba frío, pero Lily no se rindió.',
        illustration: 'Lily escalando un sendero rocoso en la montaña. Se aferra a su gorro para que no se lo lleve el viento. Su expresión es de esfuerzo pero decidida.'
      }
    ]
  },
  {
    chapter: 8,
    title: "La Cima de la Montaña",
    stories: [
      {
        part: 1,
        emojis: '🦅-guardian',
        text: 'En la cima, una gran águila con plumas como el atardecer la esperaba.',
        illustration: 'En la cima de la montaña, un águila majestuosa está posada sobre una roca. Sus plumas tienen tonos de naranja, rosa y morado. Mira a Lily con ojos inteligentes.'
      },
      {
        part: 2,
        emojis: '🦅🗣️"🌬️-test"',
        text: 'El águila, guardiana de la última flor, le dijo que debía pasar la prueba del viento.',
        illustration: 'El águila habla y de su pico salen símbolos de viento. Señala con un ala a la Flor Violeta, que crece al borde de un acantilado.'
      },
      {
        part: 3,
        emojis: '🌬️💨...💪👧',
        text: 'Una fuerte ráfaga de viento intentó empujarla. Lily se aferró a una roca, protegiendo su canasta.',
        illustration: 'Lily luchando contra una poderosa ráfaga de viento, visualizada como líneas blancas arremolinadas. Se agacha detrás de una roca, abrazando su canasta de flores.'
      },
      {
        part: 4,
        emojis: '🦅...nod...✅',
        text: 'Viendo su coraje y cómo protegía las flores, el águila asintió. Había pasado la prueba.',
        illustration: 'El viento se ha calmado. El águila mira a Lily con respeto y asiente lentamente. La prueba ha terminado.'
      },
      {
        part: 5,
        emojis: '🦅🎁-crystal',
        text: 'El águila le ofreció un pequeño cristal que contenía la esencia del cielo del amanecer.',
        illustration: 'El águila deja caer a los pies de Lily un pequeño cristal de cuarzo que contiene un remolino de colores rosa y dorado pálido en su interior.'
      },
      {
        part: 6,
        emojis: '💎+🌸=🔮✨',
        text: 'Cuando acercó el cristal a la Flor Violeta, esta absorbió su luz y brilló con todos los colores del alba.',
        illustration: 'La flor violeta ahora tiene un aura iridiscente, reflejando tonos de rosa, dorado y lavanda. Parece contener un cielo en miniatura.'
      },
      {
        part: 7,
        emojis: '🧺+🔮🌸=🌈!',
        text: '¡Lo logró! Las siete flores del arcoíris estaban juntas. Su canasta resplandecía.',
        illustration: 'La canasta de Lily brilla intensamente, emitiendo un suave arcoíris de luz. Las siete flores juntas crean un espectáculo mágico.'
      },
      {
        part: 8,
        emojis: '👋🦅...⬇️🏡',
        text: 'Se despidió del águila y comenzó el camino de regreso a casa, con el corazón lleno de esperanza.',
        illustration: 'Vista desde la cima de la montaña. Lily desciende por el sendero. Abajo, muy pequeño, se ve su pueblo. El sol se está poniendo, creando un ambiente esperanzador.'
      },
      {
        part: 9,
        emojis: '🏃‍♀️➡️🏡🌳',
        text: 'Corrió la última parte del camino, emocionada por ver si la leyenda era cierta.',
        illustration: 'Lily corriendo alegremente por el sendero que lleva a su pueblo. Su canasta brillante deja un rastro de luz de arcoíris.'
      },
      {
        part: 10,
        emojis: '👴👋😊',
        text: 'El viejo jardinero la esperaba en la entrada del jardín, sonriendo con orgullo.',
        illustration: 'El anciano jardinero esperando junto a la puerta del jardín. Sonríe cálidamente a Lily mientras ella se acerca. Sostiene una regadera dorada.'
      }
    ]
  },
  {
    chapter: 9,
    title: "La Creación de la Semilla",
    stories: [
      {
        part: 1,
        emojis: '🧺🌈➡️CIRCLE',
        text: 'En el centro del jardín, Lily colocó las siete flores en un círculo en el suelo.',
        illustration: 'Lily arrodillada en el suelo, colocando cuidadosamente las siete flores de colores en un círculo perfecto sobre el césped.'
      },
      {
        part: 2,
        emojis: '🌈🌸...🔄...✨',
        text: 'Las flores comenzaron a brillar, y sus luces se unieron en el centro del círculo.',
        illustration: 'Haces de luz de cada flor (rojo, naranja, amarillo, etc.) se extienden hacia el centro del círculo, donde comienzan a arremolinarse juntos.'
      },
      {
        part: 3,
        emojis: '✨➡️🌟',
        text: 'La luz se hizo más y más intensa, hasta que formó una sola y pequeña semilla que flotaba en el aire.',
        illustration: 'En el centro del círculo de flores, una pequeña semilla flota, emitiendo una luz blanca y brillante tan intensa que ilumina toda la escena.'
      },
      {
        part: 4,
        emojis: '🤲🌟',
        text: 'Era la Semilla de Luz Estelar. Flotó suavemente y aterrizó en las manos de Lily.',
        illustration: 'Primer plano de las manos ahuecadas de Lily, sosteniendo la Semilla de Luz Estelar, que pulsa con una luz suave y cálida.'
      },
      {
        part: 5,
        emojis: '😭😊-thanks-👴',
        text: 'Con lágrimas de alegría, Lily agradeció al jardinero por su ayuda y su sabiduría.',
        illustration: 'Lily abraza al anciano jardinero. Ambos están sonriendo. La semilla en su mano ilumina sus rostros.'
      },
      {
        part: 6,
        emojis: '🏃‍♀️➡️🏡',
        text: 'Corrió a casa, con cuidado de no dañar la preciosa semilla.',
        illustration: 'Lily corriendo hacia su casa, sosteniendo la semilla brillante con ambas manos cerca de su pecho para protegerla.'
      },
      {
        part: 7,
        emojis: '🏡...🥀-window',
        text: 'Allí estaba su flor marchita, todavía gris y sin vida en el alféizar de la ventana.',
        illustration: 'La flor gris y sin vida en su maceta, en el alféizar. La habitación está un poco oscura, contrastando con la luz que Lily está a punto de traer.'
      },
      {
        part: 8,
        emojis: '🤲🌟+🥀=❓',
        text: 'Con el corazón latiendo con fuerza, colocó la Semilla de Luz Estelar en la tierra de la maceta.',
        illustration: 'La mano de Lily colocando suavemente la semilla brillante en la tierra de la maceta, justo al lado del tallo de la flor marchita.'
      },
      {
        part: 9,
        emojis: '⏳...✨...💖',
        text: 'Por un momento, no pasó nada. Luego, un suave pulso de luz emanó de la semilla.',
        illustration: 'Un suave pulso de luz rosa se expande desde la maceta, como una onda en el agua. La flor todavía está gris.'
      },
      {
        part: 10,
        emojis: '🥀➡️🌸✨💖',
        text: 'La luz viajó por el tallo, y los pétalos grises comenzaron a recuperar su color y su brillo.',
        illustration: 'Una animación visual que muestra la luz subiendo por el tallo de la flor. Los pétalos se transforman de gris a un rosa brillante, uno por uno.'
      }
    ]
  },
  {
    chapter: 10,
    title: "Un Brillo Más Fuerte",
    stories: [
      {
        part: 1,
        emojis: '🌸✨💖-BRIGHTER!',
        text: '¡Su flor no solo había revivido, sino que ahora brillaba más fuerte y hermosa que nunca!',
        illustration: 'La flor de Lily, ahora de un rosa radiante, brilla tan intensamente que ilumina toda la habitación con una luz cálida y mágica. Lily la mira con asombro y felicidad.'
      },
      {
        part: 2,
        emojis: '💖✨➡️🏡➡️🌳',
        text: 'La luz era tan poderosa que salió por la ventana y se extendió por todo el jardín del pueblo.',
        illustration: 'Un haz de luz rosa sale de la ventana de Lily y viaja hacia el jardín del pueblo, tocando las otras flores dañadas por la tormenta.'
      },
      {
        part: 3,
        emojis: '🌳🌸✨🌸✨🌸✨',
        text: 'Dondequiera que la luz tocaba, las flores marchitas del jardín se recuperaban y brillaban también.',
        illustration: 'El jardín del pueblo, que antes estaba dañado, ahora está lleno de flores de todos los colores que brillan con una luz mágica. Es un espectáculo deslumbrante.'
      },
      {
        part: 4,
        emojis: '🧑‍🤝‍🧑😊-wow!',
        text: 'La gente del pueblo salió de sus casas, maravillada por la belleza del jardín restaurado.',
        illustration: 'La gente del pueblo (familias, niños, ancianos) de pie en el sendero del jardín, mirando con asombro y sonrisas las flores brillantes.'
      },
      {
        part: 5,
        emojis: '👧💖-center-of-✨',
        text: 'Lily estaba en el centro de todo, con su pequeña flor, feliz de haber traído alegría a todos.',
        illustration: 'Lily de pie en medio del jardín mágico, sosteniendo su flor rosa brillante. Está rodeada de luz y sonríe serenamente.'
      },
      {
        part: 6,
        emojis: '...❓...👋👵',
        text: 'De repente, una voz familiar la llamó. ¡Era su abuela, que había vuelto de visita!',
        illustration: 'La abuela de Lily está de pie en la entrada del jardín, con una maleta a su lado. Sonríe y saluda a Lily. Su rostro muestra sorpresa y orgullo.'
      },
      {
        part: 7,
        emojis: '😭🤗💖',
        text: 'Lily corrió y la abrazó con fuerza, un abrazo que había esperado durante mucho tiempo.',
        illustration: 'Lily y su abuela compartiendo un abrazo muy emotivo y cálido en medio del jardín brillante. Ambas tienen los ojos cerrados y sonríen.'
      },
      {
        part: 8,
        emojis: '👵🗣️"proud!"💖',
        text: '"Sabía que podías hacerlo", dijo su abuela, "tu amor hizo que todo floreciera de nuevo".',
        illustration: 'La abuela arrodillada, mirando a Lily a los ojos. Pone una mano en la mejilla de Lily con una expresión de profundo amor y orgullo.'
      },
      {
        part: 9,
        emojis: '👧👵-watching-✨🌸',
        text: 'Juntas, se sentaron en un banco y observaron el jardín, que brillaba más que cualquier cielo estrellado.',
        illustration: 'Lily y su abuela sentadas de espaldas en un banco, mirando el jardín mágico por la noche. Las flores iluminan la escena, creando un ambiente de paz y felicidad.'
      },
      {
        part: 10,
        emojis: '💖🌟💪😊',
        text: 'Lily aprendió que incluso de la tristeza puede nacer algo hermoso, si se cuida con esfuerzo y esperanza.',
        illustration: 'La imagen final: Lily sosteniendo su flor, que ahora tiene una pequeña estrella en su centro. Ella mira directamente al espectador con una sonrisa confiada y feliz. El fondo es el jardín brillante.'
      }
    ]
  }
];

// This is the old data structure, renamed to avoid breaking existing imports immediately.
// It should be removed once all references are updated.
export const LILY_STORY = LILY_STORY_CHAPTERS.flatMap(c => c.stories.map(s => ({
  chapter: (c.chapter - 1) * 10 + s.part,
  ...s
})));
