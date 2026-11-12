// WCAG relative luminance, using the exact shipped main foreground/background pairs.
const luminance = hex => {
  const rgb = hex.match(/[a-f\d]{2}/gi).map(x => parseInt(x, 16) / 255).map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
};
const pairs = [
  ['Sand / Charcoal', '#e8dcc4', '#2b2930', 4.5],
  ['Sand / Midnight', '#e8dcc4', '#141219', 4.5],
  ['Sand / Deep Purple button', '#e8dcc4', '#593b9d', 4.5],
  ['Soft Purple / Charcoal', '#c5a9fa', '#2b2930', 4.5],
  ['Electric Purple focus / Midnight', '#8b5cf6', '#141219', 3],
];
for (const [name, foreground, background, minimum] of pairs) {
  const values = [luminance(foreground), luminance(background)].sort((a,b) => b-a);
  const ratio = (values[0] + .05) / (values[1] + .05);
  console.log(`${name}: ${ratio.toFixed(2)}:1`);
  if (ratio < minimum) process.exitCode = 1;
}
