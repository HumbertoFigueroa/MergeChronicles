import type { Item, ItemType, Order } from './types';

const createItem = (id: string, name: string, level: number, type: ItemType, emoji: string): Item => ({
  id,
  name,
  level,
  type,
  emoji,
});

export const ITEMS: Record<string, Item> = {
  // Animals
  animals_1: createItem('animals_1', 'Huevo', 1, 'animals', '🐣'),
  animals_2: createItem('animals_2', 'Pollo', 2, 'animals', '🐔'),
  animals_3: createItem('animals_3', 'Vaca', 3, 'animals', '🐄'),
  animals_4: createItem('animals_4', 'Cerdo', 4, 'animals', '🐖'),
  animals_5: createItem('animals_5', 'Oveja', 5, 'animals', '🐑'),
  animals_6: createItem('animals_6', 'Perro', 6, 'animals', '🐕'),
  animals_7: createItem('animals_7', 'Gato', 7, 'animals', '🐈'),
  animals_8: createItem('animals_8', 'Conejo', 8, 'animals', '🐇'),
  animals_9: createItem('animals_9', 'Caballo', 9, 'animals', '🐎'),
  animals_10: createItem('animals_10', 'Elefante', 10, 'animals', '🐘'),
  animals_11: createItem('animals_11', 'Tigre', 11, 'animals', '🐅'),
  animals_12: createItem('animals_12', 'León', 12, 'animals', '🦁'),

  // Flags
  flags_1: createItem('flags_1', 'Bandera Blanca', 1, 'flags', '🏳️'),
  flags_2: createItem('flags_2', 'Bandera ONU', 2, 'flags', '🇺🇳'),
  flags_3: createItem('flags_3', 'Bandera España', 3, 'flags', '🇪🇸'),
  flags_4: createItem('flags_4', 'Bandera México', 4, 'flags', '🇲🇽'),
  flags_5: createItem('flags_5', 'Bandera Argentina', 5, 'flags', '🇦🇷'),
  flags_6: createItem('flags_6', 'Bandera Colombia', 6, 'flags', '🇨🇴'),
  flags_7: createItem('flags_7', 'Bandera Perú', 7, 'flags', '🇵🇪'),
  flags_8: createItem('flags_8', 'Bandera Venezuela', 8, 'flags', '🇻🇪'),
  flags_9: createItem('flags_9', 'Bandera Chile', 9, 'flags', '🇨🇱'),
  flags_10: createItem('flags_10', 'Bandera Ecuador', 10, 'flags', '🇪🇨'),
  flags_11: createItem('flags_11', 'Bandera Bolivia', 11, 'flags', '🇧🇴'),
  flags_12: createItem('flags_12', 'Bandera Pirata', 12, 'flags', '🏴‍☠️'),

  // Professions
  professions_1: createItem('professions_1', 'Estudiante', 1, 'professions', '🧑‍🎓'),
  professions_2: createItem('professions_2', 'Profesor', 2, 'professions', '🧑‍🏫'),
  professions_3: createItem('professions_3', 'Doctor', 3, 'professions', '🧑‍⚕️'),
  professions_4: createItem('professions_4', 'Juez', 4, 'professions', '🧑‍⚖️'),
  professions_5: createItem('professions_5', 'Granjero', 5, 'professions', '🧑‍🌾'),
  professions_6: createItem('professions_6', 'Cocinero', 6, 'professions', '🧑‍🍳'),
  professions_7: createItem('professions_7', 'Mecánico', 7, 'professions', '🧑‍🔧'),
  professions_8: createItem('professions_8', 'Científico', 8, 'professions', '🧑‍🔬'),
  professions_9: createItem('professions_9', 'Artista', 9, 'professions', '🧑‍🎨'),
  professions_10: createItem('professions_10', 'Astronauta', 10, 'professions', '🧑‍🚀'),
  professions_11: createItem('professions_11', 'Piloto', 11, 'professions', '🧑‍✈️'),
  professions_12: createItem('professions_12', 'Bombero', 12, 'professions', '🧑‍🚒'),
  
  // Clothing
  clothing_1: createItem('clothing_1', 'Gorra', 1, 'clothing', '🧢'),
  clothing_2: createItem('clothing_2', 'Camiseta', 2, 'clothing', '👕'),
  clothing_3: createItem('clothing_3', 'Pantalones', 3, 'clothing', '👖'),
  clothing_4: createItem('clothing_4', 'Vestido', 4, 'clothing', '👗'),
  clothing_5: createItem('clothing_5', 'Kimono', 5, 'clothing', '👘'),
  clothing_6: createItem('clothing_6', 'Tacón Alto', 6, 'clothing', '👠'),
  clothing_7: createItem('clothing_7', 'Bata de Laboratorio', 7, 'clothing', '🥼'),
  clothing_8: createItem('clothing_8', 'Corbata', 8, 'clothing', '👔'),
  clothing_9: createItem('clothing_9', 'Sombrero', 9, 'clothing', '👒'),
  clothing_10: createItem('clothing_10', 'Guantes', 10, 'clothing', '🧤'),
  clothing_11: createItem('clothing_11', 'Bufanda', 11, 'clothing', '🧣'),
  clothing_12: createItem('clothing_12', 'Abrigo', 12, 'clothing', '🧥'),

  // Food
  food_1: createItem('food_1', 'Uvas', 1, 'food', '🍇'),
  food_2: createItem('food_2', 'Melón', 2, 'food', '🍈'),
  food_3: createItem('food_3', 'Sandía', 3, 'food', '🍉'),
  food_4: createItem('food_4', 'Naranja', 4, 'food', '🍊'),
  food_5: createItem('food_5', 'Limón', 5, 'food', '🍋'),
  food_6: createItem('food_6', 'Plátano', 6, 'food', '🍌'),
  food_7: createItem('food_7', 'Piña', 7, 'food', '🍍'),
  food_8: createItem('food_8', 'Mango', 8, 'food', '🥭'),
  food_9: createItem('food_9', 'Manzana Roja', 9, 'food', '🍎'),
  food_10: createItem('food_10', 'Manzana Verde', 10, 'food', '🍏'),
  food_11: createItem('food_11', 'Pera', 11, 'food', '🍐'),
  food_12: createItem('food_12', 'Melocotón', 12, 'food', '🍑'),
};

export const MERGE_RULES: Record<string, string> = {
  // Animals
  animals_1: 'animals_2', animals_2: 'animals_3', animals_3: 'animals_4', animals_4: 'animals_5', animals_5: 'animals_6', animals_6: 'animals_7', animals_7: 'animals_8', animals_8: 'animals_9', animals_9: 'animals_10', animals_10: 'animals_11', animals_11: 'animals_12',
  // Flags
  flags_1: 'flags_2', flags_2: 'flags_3', flags_3: 'flags_4', flags_4: 'flags_5', flags_5: 'flags_6', flags_6: 'flags_7', flags_7: 'flags_8', flags_8: 'flags_9', flags_9: 'flags_10', flags_10: 'flags_11', flags_11: 'flags_12',
  // Professions
  professions_1: 'professions_2', professions_2: 'professions_3', professions_3: 'professions_4', professions_4: 'professions_5', professions_5: 'professions_6', professions_6: 'professions_7', professions_7: 'professions_8', professions_8: 'professions_9', professions_9: 'professions_10', professions_10: 'professions_11', professions_11: 'professions_12',
  // Clothing
  clothing_1: 'clothing_2', clothing_2: 'clothing_3', clothing_3: 'clothing_4', clothing_4: 'clothing_5', clothing_5: 'clothing_6', clothing_6: 'clothing_7', clothing_7: 'clothing_8', clothing_8: 'clothing_9', clothing_9: 'clothing_10', clothing_10: 'clothing_11', clothing_11: 'clothing_12',
  // Food
  food_1: 'food_2', food_2: 'food_3', food_3: 'food_4', food_4: 'food_5', food_5: 'food_6', food_6: 'food_7', food_7: 'food_8', food_8: 'food_9', food_9: 'food_10', food_10: 'food_11', food_11: 'food_12',
};

export const STORY_DIALOGUES: string[] = [
    "Un huevo solitario... ¿Qué podría salir de aquí?",
    "Con una bandera en mano, sientes el impulso de explorar el mundo y conocer nuevas culturas.",
    "Este delantal de cocinero te queda perfecto. Te sientes listo para preparar un banquete.",
    "Un abrigo elegante. Te da un aire de misterio y sofisticación. ¿A dónde te llevará?",
    "Una manzana brillante y jugosa. Dicen que una al día mantiene al doctor en la lejanía... o quizás atrae nuevas aventuras.",
    "Has desbloqueado al León, ¡el rey de la sabana! Tu zoológico personal está creciendo.",
];

export const INITIAL_ORDERS: Order[] = [
    {
        id: 'order-1',
        customerEmoji: '👩‍🌾',
        requiredItems: [{ itemId: 'animals_2', quantity: 1 }],
        reward: { gems: 5 }
    },
    {
        id: 'order-2',
        customerEmoji: '👨‍🎨',
        requiredItems: [{ itemId: 'clothing_3', quantity: 2 }],
        reward: { gems: 10 }
    },
    {
        id: 'order-3',
        customerEmoji: '👸',
        requiredItems: [
            { itemId: 'food_4', quantity: 1 },
            { itemId: 'animals_4', quantity: 1 }
        ],
        reward: { gems: 25 }
    }
];
