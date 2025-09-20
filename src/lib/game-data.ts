import type { Item, ItemType } from './types';
import { findImage } from './utils';

const createItem = (id: string, name: string, level: number, type: ItemType): Item => ({
  id,
  name,
  level,
  type,
  image: findImage(id),
});

export const ITEMS: Record<string, Item> = {
  // Shoes
  sandal_1: createItem('sandal_1', 'Plain Sandal', 1, 'shoe'),
  heels_2: createItem('heels_2', 'Strappy Heels', 2, 'shoe'),
  pump_3: createItem('pump_3', 'Elegant Pump', 3, 'shoe'),
  boot_4: createItem('boot_4', 'Designer Boot', 4, 'shoe'),
  // Dresses
  fabric_1: createItem('fabric_1', 'Fabric Scraps', 1, 'dress'),
  tunic_2: createItem('tunic_2', 'Simple Tunic', 2, 'dress'),
  cocktail_3: createItem('cocktail_3', 'Cocktail Dress', 3, 'dress'),
  gown_4: createItem('gown_4', 'Evening Gown', 4, 'dress'),
  // Accessories
  gem_1: createItem('gem_1', 'Small Gem', 1, 'accessory'),
  necklace_2: createItem('necklace_2', 'Gemstone Necklace', 2, 'accessory'),
  tiara_3: createItem('tiara_3', 'Diamond Tiara', 3, 'accessory'),
  crown_4: createItem('crown_4', 'Royal Crown', 4, 'accessory'),
};

export const MERGE_RULES: Record<string, string> = {
  sandal_1: 'heels_2',
  heels_2: 'pump_3',
  pump_3: 'boot_4',
  fabric_1: 'tunic_2',
  tunic_2: 'cocktail_3',
  cocktail_3: 'gown_4',
  gem_1: 'necklace_2',
  necklace_2: 'tiara_3',
  tiara_3: 'crown_4',
};

export const STORY_DIALOGUES: string[] = [
    "A spark of inspiration! These fabric scraps could become something more...",
    "With a new pair of heels, you feel a surge of confidence. The city's most exclusive gala is approaching. Are you ready?",
    "This cocktail dress is stunning! It reminds you of a mysterious invitation you received...",
    "A royal crown! Rumors whisper of a lost princess. Could this be a clue to your own past?",
    "The gala is tonight. You've created a masterpiece, but a rival designer, 'Silas', might challenge your claim to fame.",
    "You found a locket hidden in the lining of the evening gown. It has a single initial engraved on it: 'A'.",
];
