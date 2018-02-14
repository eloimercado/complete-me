import Node from './Node';

export default class Trie {
  constructor() {
    this.count = 0;
    this.children = {};
  }

  insert(word) {
    this.count++;
    let splitWord = word.split('');
    let currentNode = this.children;
   
    while (splitWord.length) {
      let firstLetter = splitWord.shift();
     
      if (!currentNode[firstLetter]) {
        currentNode[firstLetter] = new Node();
      }
      if (!splitWord.length) {
        currentNode[firstLetter].completeWord = word;
      }
      currentNode = currentNode[firstLetter].children;
    }
  }

  suggest(prefix) {
    let letters = prefix.split('');
    let currentLevel = this.children;
    let suggestions = [];
   
    while (letters.length) {
      let currentLetter = letters.shift();
      
      if (Object.keys(currentLevel).find(letter => letter === currentLetter)) {
        currentLevel = currentLevel[currentLetter].children;
      } else {
        return suggestions;
      }
    }
   
    let letterOptions = Object.keys(currentLevel);
    
    const findWords = (array, level) => {
      array.forEach(letter => {
        let recursiveLevel = level;
        
        if (recursiveLevel[letter].completeWord) {
          if (recursiveLevel[letter].popularity  === 0) {
            suggestions.push(recursiveLevel[letter].completeWord);
          } else {
            suggestions.unshift(recursiveLevel[letter].completeWord);
          }
        }
        if (Object.keys(recursiveLevel[letter].children).length) {
          recursiveLevel = recursiveLevel[letter].children;
          findWords(Object.keys(recursiveLevel), recursiveLevel);
        }
      });
    };
    
    findWords(letterOptions, currentLevel);
    return suggestions;
  }

  populate(array) {
    array.forEach( word => {
      this.insert(word);
    });
  }

  select(string) {
    let letters = string.split('');
    let currentLevel = this.children;
   
    while (letters.length > 1) {
      let currentLetter = letters.shift();

      if (Object.keys(currentLevel).find(letter => letter === currentLetter)) {
        currentLevel = currentLevel[currentLetter].children;
      }
    }
    currentLevel[letters].popularity++;
  }

  delete(string) {
    let letters = string.split('');
    let currentLevel = this.children;
    
    while (letters.length > 1) {
      let currentLetter = letters.shift();
      
      if (Object.keys(currentLevel).find(letter => letter === currentLetter)) {
        currentLevel = currentLevel[currentLetter].children;
      }
    }
    currentLevel[letters].completeWord = false;
  }
}