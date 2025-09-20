import type { Item, ItemType, Order } from './types';
import { findImage } from './utils';

const createItem = (id: string, name: string, level: number, type: ItemType): Item => ({
  id,
  name,
  level,
  type,
  image: findImage(id, name), 
});

export const ITEMS: Record<string, Item> = {
  // Jewelry
  jewelry_1: createItem('jewelry_1', 'Anillo Simple', 1, 'jewelry'),
  jewelry_2: createItem('jewelry_2', 'Anillo de Piedra', 2, 'jewelry'),
  jewelry_3: createItem('jewelry_3', 'Pendientes de Perla', 3, 'jewelry'),
  jewelry_4: createItem('jewelry_4', 'Collar Fino', 4, 'jewelry'),
  jewelry_5: createItem('jewelry_5', 'Pulsera de Abalorios', 5, 'jewelry'),
  jewelry_6: createItem('jewelry_6', 'Aros de Diamantes', 6, 'jewelry'),
  jewelry_7: createItem('jewelry_7', 'Collar de Cristal', 7, 'jewelry'),
  jewelry_8: createItem('jewelry_8', 'Pulsera con Dijes', 8, 'jewelry'),
  jewelry_9: createItem('jewelry_9', 'Anillo de Oro', 9, 'jewelry'),
  jewelry_10: createItem('jewelry_10', 'Pendientes Colgantes', 10, 'jewelry'),
  jewelry_11: createItem('jewelry_11', 'Collar de Perlas', 11, 'jewelry'),
  jewelry_12: createItem('jewelry_12', 'Tiara de Gemas', 12, 'jewelry'),

  // Makeup
  makeup_1: createItem('makeup_1', 'Brillo Labial', 1, 'makeup'),
  makeup_2: createItem('makeup_2', 'Lápiz Labial Pastel', 2, 'makeup'),
  makeup_3: createItem('makeup_3', 'Rubor Compacto', 3, 'makeup'),
  makeup_4: createItem('makeup_4', 'Sombra Individual', 4, 'makeup'),
  makeup_5: createItem('makeup_5', 'Mascara de Pestañas', 5, 'makeup'),
  makeup_6: createItem('makeup_6', 'Delineador de Ojos', 6, 'makeup'),
  makeup_7: createItem('makeup_7', 'Pinceles Básicos', 7, 'makeup'),
  makeup_8: createItem('makeup_8', 'Estuche de Sombras', 8, 'makeup'),
  makeup_9: createItem('makeup_9', 'Base Líquida', 9, 'makeup'),
  makeup_10: createItem('makeup_10', 'Paleta de Contorno', 10, 'makeup'),
  makeup_11: createItem('makeup_11', 'Set de Pinceles Pro', 11, 'makeup'),
  makeup_12: createItem('makeup_12', 'Paleta de Maquillaje', 12, 'makeup'),

  // Shoes
  shoes_1: createItem('shoes_1', 'Sandalias Simples', 1, 'shoes'),
  shoes_2: createItem('shoes_2', 'Zapatillas de Lona', 2, 'shoes'),
  shoes_3: createItem('shoes_3', 'Bailarinas con Lazo', 3, 'shoes'),
  shoes_4: createItem('shoes_4', 'Sandalias de Cuña', 4, 'shoes'),
  shoes_5: createItem('shoes_5', 'Botines Cortos', 5, 'shoes'),
  shoes_6: createItem('shoes_6', 'Zapatos con Brillos', 6, 'shoes'),
  shoes_7: createItem('shoes_7', 'Zapatos de Tacón Bajo', 7, 'shoes'),
  shoes_8: createItem('shoes_8', 'Botas Altas', 8, 'shoes'),
  shoes_9: createItem('shoes_9', 'Zapatos de Tacón Alto', 9, 'shoes'),
  shoes_10: createItem('shoes_10', 'Zapatos de Plataforma', 10, 'shoes'),
  shoes_11: createItem('shoes_11', 'Zapatos de Princesa', 11, 'shoes'),
  shoes_12: createItem('shoes_12', 'Zapatos de Cristal', 12, 'shoes'),

  // Clothing
  clothing_1: createItem('clothing_1', 'Camiseta Básica', 1, 'clothing'),
  clothing_2: createItem('clothing_2', 'Falda de Mezclilla', 2, 'clothing'),
  clothing_3: createItem('clothing_3', 'Top de Tirantes', 3, 'clothing'),
  clothing_4: createItem('clothing_4', 'Vestido de Verano', 4, 'clothing'),
  clothing_5: createItem('clothing_5', 'Pantalones Vaqueros', 5, 'clothing'),
  clothing_6: createItem('clothing_6', 'Sudadera con Capucha', 6, 'clothing'),
  clothing_7: createItem('clothing_7', 'Blusa Elegante', 7, 'clothing'),
  clothing_8: createItem('clothing_8', 'Chaqueta de Mezclilla', 8, 'clothing'),
  clothing_9: createItem('clothing_9', 'Conjunto Coordinado', 9, 'clothing'),
  clothing_10: createItem('clothing_10', 'Vestido de Cóctel', 10, 'clothing'),
  clothing_11: createItem('clothing_11', 'Abrigo Elegante', 11, 'clothing'),
  clothing_12: createItem('clothing_12', 'Vestido de Gala', 12, 'clothing'),

  // Bags
  bags_1: createItem('bags_1', 'Monedero Simple', 1, 'bags'),
  bags_2: createItem('bags_2', 'Cartera Pequeña', 2, 'bags'),
  bags_3: createItem('bags_3', 'Bolso de Hombro', 3, 'bags'),
  bags_4: createItem('bags_4', 'Mochila Colorida', 4, 'bags'),
  bags_5: createItem('bags_5', 'Bolso de Mano', 5, 'bags'),
  bags_6: createItem('bags_6', 'Bandolera con Adornos', 6, 'bags'),
  bags_7: createItem('bags_7', 'Clutch Brillante', 7, 'bags'),
  bags_8: createItem('bags_8', 'Bolso de Asas', 8, 'bags'),
  bags_9: createItem('bags_9', 'Bolso de Cuero', 9, 'bags'),
  bags_10: createItem('bags_10', 'Bolso de Diseñador', 10, 'bags'),
  bags_11: createItem('bags_11', 'Bolso de Noche', 11, 'bags'),
  bags_12: createItem('bags_12', 'Bolso de Alta Costura', 12, 'bags'),
};

export const MERGE_RULES: Record<string, string> = {
  // Jewelry
  jewelry_1: 'jewelry_2', jewelry_2: 'jewelry_3', jewelry_3: 'jewelry_4', jewelry_4: 'jewelry_5', jewelry_5: 'jewelry_6', jewelry_6: 'jewelry_7', jewelry_7: 'jewelry_8', jewelry_8: 'jewelry_9', jewelry_9: 'jewelry_10', jewelry_10: 'jewelry_11', jewelry_11: 'jewelry_12',
  // Makeup
  makeup_1: 'makeup_2', makeup_2: 'makeup_3', makeup_3: 'makeup_4', makeup_4: 'makeup_5', makeup_5: 'makeup_6', makeup_6: 'makeup_7', makeup_7: 'makeup_8', makeup_8: 'makeup_9', makeup_9: 'makeup_10', makeup_10: 'makeup_11', makeup_11: 'makeup_12',
  // Shoes
  shoes_1: 'shoes_2', shoes_2: 'shoes_3', shoes_3: 'shoes_4', shoes_4: 'shoes_5', shoes_5: 'shoes_6', shoes_6: 'shoes_7', shoes_7: 'shoes_8', shoes_8: 'shoes_9', shoes_9: 'shoes_10', shoes_10: 'shoes_11', shoes_11: 'shoes_12',
  // Clothing
  clothing_1: 'clothing_2', clothing_2: 'clothing_3', clothing_3: 'clothing_4', clothing_4: 'clothing_5', clothing_5: 'clothing_6', clothing_6: 'clothing_7', clothing_7: 'clothing_8', clothing_8: 'clothing_9', clothing_9: 'clothing_10', clothing_10: 'clothing_11', clothing_11: 'clothing_12',
  // Bags
  bags_1: 'bags_2', bags_2: 'bags_3', bags_3: 'bags_4', bags_4: 'bags_5', bags_5: 'bags_6', bags_6: 'bags_7', bags_7: 'bags_8', bags_8: 'bags_9', bags_9: 'bags_10', bags_10: 'bags_11', bags_11: 'bags_12',
};

export const STORY_DIALOGUES: string[] = [
    "A spark of inspiration! These fabric scraps could become something more...",
    "With a new pair of heels, you feel a surge of confidence. The city's most exclusive gala is approaching. Are you ready?",
    "This cocktail dress is stunning! It reminds you of a mysterious invitation you received...",
    "A royal crown! Rumors whisper of a lost princess. Could this be a clue to your own past?",
    "The gala is tonight. You've created a masterpiece, but a rival designer, 'Silas', might challenge your claim to fame.",
    "You found a locket hidden in the lining of the evening gown. It has a single initial engraved on it: 'A'.",
];

export const INITIAL_ORDERS: Order[] = [
    {
        id: 'order-1',
        customerEmoji: '👩‍🎤',
        requiredItems: [{ itemId: 'shoes_2', quantity: 1 }],
        reward: { gems: 5 }
    },
    {
        id: 'order-2',
        customerEmoji: '👨‍💼',
        requiredItems: [{ itemId: 'clothing_3', quantity: 2 }],
        reward: { gems: 10 }
    },
    {
        id: 'order-3',
        customerEmoji: '👸',
        requiredItems: [
            { itemId: 'clothing_10', quantity: 1 },
            { itemId: 'jewelry_7', quantity: 1 }
        ],
        reward: { gems: 25 }
    }
];
