import { CategoryInfo } from "../notion/notionKeys";
import errorColor from "./errorColor";

const MAX_CATEGORIES = 12;

// [!] All rows must have the same length
const KEYS = [
  ["q", "w", "e", "r"],
  ["a", "s", "d", "f"],
  ["z", "x", "c", "v"],
];

export default function categoriesMenu(categories: CategoryInfo[]) {
  if (categories.length > MAX_CATEGORIES) {
    throw new Error(errorColor(`Max categories allowed is ${MAX_CATEGORIES}`));
  }

  const menuDisplay = KEYS.map((row) => row);
  const menuMap = new Map<string, string | undefined>(); // key -> catId

  let maxCatLength = 0;

  for (let i = 0; i < KEYS.length; i++) {
    for (let j = 0; j < KEYS[i].length; j++) {
      const key = KEYS[i][j];
      const cat = categories.at(i * KEYS[i].length + j);
      const toDisplay = `[${key.toUpperCase()}] ${cat?.catName || "-"}`;

      maxCatLength = Math.max(maxCatLength, toDisplay.length);

      menuDisplay[i][j] = toDisplay;
      menuMap.set(key, cat?.catId);
    }
  }

  let stringMenu = "";

  const menuWidth = (maxCatLength + 3) * menuDisplay[0].length - 1;

  // ========== Add title ==========
  const text = "Choose a category for each transaction";
  const length = text.length;
  let top = "╔" + "═".repeat(length + 2) + "╗";
  let mid = `║ ${text} ║`;
  let bot = "╚" + "═".repeat(length + 2) + "╝";

  const padding = (menuWidth - top.length) / 2 + 1;

  top = " ".repeat(padding) + top;
  mid = " ".repeat(padding) + mid;
  bot = " ".repeat(padding) + bot;

  const TITLE = `${top}\n${mid}\n${bot}\n`;

  stringMenu += TITLE;

  // ========== Add keys ==========
  const topKeys = "╔" + "═".repeat(menuWidth) + "╗\n";
  const botKeys = "╚" + "═".repeat(menuWidth) + "╝";

  stringMenu += topKeys;

  for (const row of menuDisplay) {
    stringMenu += "║ ";
    for (const toDisplay of row) {
      stringMenu += toDisplay.padEnd(maxCatLength) + " ║ ";
    }
    stringMenu += "\n";
  }

  stringMenu += botKeys;

  return {
    stringMenu,
    menuMap,
  };
}
