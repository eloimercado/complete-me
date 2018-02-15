import Node from './Node';

export default class Trie {
  constructor() {
    this.count = 0;
    this.children = {};
  }
  
  insert(word) {
    let letters = word.split('');
    let currentNode = this.children;

    while (letters.length) {
      let currentLetter = letters.shift();

      if (!currentNode[currentLetter]) {
        currentNode[currentLetter] = new Node();
      }
      if (!letters.length && currentNode[currentLetter].completeWord === false) {
        this.count++;
        currentNode[currentLetter].completeWord = word;
      }  
      currentNode = currentNode[currentLetter].children;
    }
  }
  
  findNode(word) {
    let lettersArray = word.split('');
    let currentNode = this.children;
    
    while (lettersArray.length) { 
      let currentLetter = lettersArray.shift();
      
      if (Object.keys(currentNode).find(letter => letter === currentLetter)) {
        currentNode = currentNode[currentLetter].children;
      } 
    }
    return currentNode;
  }

  suggest(word) {
    const currentNode = this.findNode(word);
    let suggestionsArray = [];
    let nodeKeys = Object.keys(currentNode);
    const searchWords = (array, level) => {
      array.forEach(letter => {
        let nodeLevel = level;

        if (nodeLevel[letter].completeWord) {
          if (nodeLevel[letter].popularity === 0) {
            suggestionsArray.push(nodeLevel[letter].completeWord);
          } else {
            suggestionsArray.unshift(nodeLevel[letter].completeWord);
          }
        }

        if (Object.keys(nodeLevel[letter].children).length) {
          nodeLevel = nodeLevel[letter].children;
          searchWords(Object.keys(nodeLevel), nodeLevel);
        }
      });
    };

    searchWords(nodeKeys, currentNode);
    return suggestionsArray;
  }
  
  populate(array) {
    array.forEach( word => {
      this.insert(word);
    });
  }
  
  transverseDown(lettersArray) {
    let currentNode = this.children;
    
    while (lettersArray.length > 1) { 
      let currentLetter = lettersArray.shift();
      
      if (Object.keys(currentNode).find(letter => letter === currentLetter)) {
        currentNode = currentNode[currentLetter].children;
      }
    }
    return currentNode;
  }
  
  select(word) {
    let lettersArray = word.split('');
    let lastNode = this.transverseDown(lettersArray); 
   
    lastNode[lettersArray].popularity++;
  }
  
  delete(word) {
    let lettersArray = word.split('');
    let lastNode = this.transverseDown(lettersArray);
    
    lastNode[lettersArray].completeWord = false;
  }
}