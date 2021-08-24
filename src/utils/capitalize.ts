export default function capitalize(string: string) {
  if (typeof string !== 'string') {
    throw new Error('Error: capitalize(string) expects a string argument.');
  }

  return string.charAt(0).toUpperCase() + string.slice(1);
}
