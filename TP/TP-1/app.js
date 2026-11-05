import { red, green } from "./mensaje.js";
import { getOSName, getOSTotalMem } from "./os.js";

console.log("Leonardo Bonecco");
console.log("Todo conocimiento suma al ecosistema del desarrollo");

console.log(red(getOSName()));
console.log(green(getOSTotalMem()));
