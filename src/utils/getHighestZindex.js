export default function getHighestZIndex() {
  Array.from(document.querySelectorAll('*'))
    .map((el) => [el, getComputedStyle(el).zIndex])
    .filter((v) => !isNaN(parseInt(v[1])))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // pega apenas os 5 maiores
}
