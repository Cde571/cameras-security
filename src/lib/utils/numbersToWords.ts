const units = ["cero","uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve"];
const teens = ["diez","once","doce","trece","catorce","quince","dieciséis","diecisiete","dieciocho","diecinueve"];
const tens = ["","","veinte","treinta","cuarenta","cincuenta","sesenta","setenta","ochenta","noventa"];
const hundreds = ["","ciento","doscientos","trescientos","cuatrocientos","quinientos","seiscientos","setecientos","ochocientos","novecientos"];

function under100(n: number): string {
  if (n < 10) return units[n];
  if (n < 20) return teens[n - 10];
  if (n < 30) return n === 20 ? "veinte" : `veinti${units[n - 20]}`;
  const t = Math.floor(n / 10);
  const u = n % 10;
  return u === 0 ? tens[t] : `${tens[t]} y ${units[u]}`;
}

function under1000(n: number): string {
  if (n === 100) return "cien";
  if (n < 100) return under100(n);
  const h = Math.floor(n / 100);
  const rest = n % 100;
  return rest === 0 ? hundreds[h] : `${hundreds[h]} ${under100(rest)}`;
}

export function numberToWordsEs(n: number): string {
  n = Math.floor(Number(n || 0));
  if (n < 1000) return under1000(n);

  const thousands = Math.floor(n / 1000);
  const rest = n % 1000;

  const left = thousands === 1 ? "mil" : `${under1000(thousands)} mil`;
  const right = rest ? ` ${under1000(rest)}` : "";
  return `${left}${right}`.trim();
}
