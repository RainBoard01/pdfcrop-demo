export const toLines = (plainText) =>
  plainText[0]
    .split("\r\n") // Split lines
    .filter((line) => line) // Remove empty lines
    .map((line) => line.trim()) // Remove whitespace
    .map((line) => line.split(/\s\s+/)); // Split on whitespace greater than 2
