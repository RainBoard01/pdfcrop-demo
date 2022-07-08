export const toJSON = (toSearch, words) => {
  const index = words.indexOf(toSearch);
  return {
    prev: {
      region: words[index - 9],
      nave: words[index - 8],
      rpa: words[index - 7],
      matricula: words[index - 6],
      capitania: words[index - 5],
      vigencia: words[index - 4],
      armador: words[index - 3],
    },
    target: {
      region: words[index - 2],
      nave: words[index - 1],
      rpa: words[index],
      matricula: words[index + 1],
      capitania: words[index + 2],
      vigencia: words[index + 3],
      armador: words[index + 4],
    },
    next: {
      region: words[index + 5],
      nave: words[index + 6],
      rpa: words[index + 7],
      matricula: words[index + 8],
      capitania: words[index + 9],
      vigencia: words[index + 10],
      armador: words[index + 11],
    },
  };
};
