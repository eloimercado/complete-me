import { expect } from 'chai';
import Node from '../lib/Node';
import Trie from '../lib/Trie';
import fs from 'fs';

const text = "/usr/share/dict/words"
const dictionary = fs.readFileSync(text).toString().trim().split('\n')


describe('TRIE', () => {
  let trie;

  beforeEach(() => {
    trie = new Trie();
  });

  it('should instantiate our good friend trie', () => {
    expect(trie).to.exist;
  });

  it('should track count', () => {
    expect(trie.count).to.equal(0);
  });

  it('should store child nodes', () => {
    expect(trie.children).to.deep.equal({});
  });
  
  describe('INSERT', () => {
    it('should increment the number of words', () => {
      trie.insert('tacocat');
      
      expect(trie.count).to.equal(1);
    });

    it('should not increment count duplicate words', () => {
      trie.insert('tacocat');
      trie.insert('tacocat');

      expect(trie.count).to.equal(1);
    });

    it('should create keys in children object of first letter', () => {
      trie.insert('tacocat');
      trie.insert('pizza');
      trie.insert('cat');
      
      expect(Object.keys(trie.children)).to.deep.equal(['t', 'p', 'c']);
    });

    it('should add word', () => {
      trie.insert('pizza');
      trie.insert('pizzas');
      trie.insert('piano');
      trie.insert('dog');
      trie.insert('dogs');

      expect(trie.children['d']).to.exit;
      expect(trie.children['d'].children['o']).to.exit;
      expect(trie.children['d'].children['o'].children['g']).to.exist;
      expect(trie.children['d'].children['o'].children['g'].completeWord).to.equal('dog');
    });
  });

  describe('SUGGEST', () => {
    beforeEach(() => {
      trie.insert('pizza');
      trie.insert('pizzas');
      trie.insert('piano');
      trie.insert('dog');
      trie.insert('dogs');
    });

    it('should return an array of suggested words', () => {
      let results = trie.suggest('piz');
      let check1 = results.some(result => result === 'pizza');
      let check2 = results.some(result => result === 'pizzas');
      let check3 = results.some(result => result === 'piano');
      let check4 = results.some(result => result === 'dog');
      
      expect(check1).to.be.true;
      expect(check2).to.be.true;
      expect(check3).to.be.false;
      expect(check4).to.be.false;
    });
    
    it('should suggest words from the dictionary', () => {
      trie.populate(dictionary);     

      expect(trie.suggest('piz')).to.deep.equal(['pizza', 'pizzas', 'pizzeria', 'pizzicato', 'pizzle', 'pize']);
    });
  });

  describe('POPULATE', () => {
    it('should insert array of words', () => {
      let array = ['piano', 'cat', 'dog'];

      expect(trie.count).to.equal(0);

      trie.populate(array);
      expect(trie.count).to.equal(3);
    });

    it('should populate a dictionary of words', () => {
      expect(trie.count).to.equal(0);

      trie.populate(dictionary);

      expect(trie.count).to.equal(235886);
    });
  });

  describe('SELECT', () => {
    it('should prioritize selected words', () => {
      trie.populate(dictionary);

      expect(trie.suggest('piz')).to.deep.equal(['pize', 'pizza', 'pizzeria', 'pizzicato', 'pizzle']);

      trie.select('pizzeria');

      expect(trie.suggest('piz')).to.deep.equal(["pizzeria", "pize", "pizza", "pizzicato", "pizzle"]);
    });
  });

  describe('Delete', () => {
    it('should remove deleted word from suggestions ', () => {
      trie.populate(dictionary);

      expect(trie.suggest('piz')).to.deep.eq(['pize', 'pizza', 'pizzeria', 'pizzicato', 'pizzle']);

      trie.delete('pizzeria');


      expect(trie.suggest('piz')).to.deep.eq(['pize', 'pizza', 'pizzicato', 'pizzle']); 
    });
  });
});