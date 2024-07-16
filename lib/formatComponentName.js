export default function formatComponentName(word) {
  // split the word before the capital letter if there is one
  const splitWord = word.replace(/([A-Z])/g, ' $1');
  // capitalize the first letter of each word
  return splitWord.charAt(0).toUpperCase() + splitWord.slice(1);
};