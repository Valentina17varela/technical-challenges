import fs from "fs";


interface Product {
  id: string;
  name: string;
}

class TrieNode {
  public children: Map<string, TrieNode>
  public isEndOfWord: boolean
  public word: Product | null;

  constructor(){
    this.children = new Map<string, TrieNode>();
    this.isEndOfWord = false
    this.word = null
  }
}

class Autocomplete {
  private root: TrieNode;

  constructor(){
    this.root = new TrieNode();
  }

  insert(word: Product): void {
    if(!word){
      return;
    }

    let current = this.root
    const normalizedWord = word.name.toLowerCase();

    for(const char of normalizedWord){
      if(!current.children.has(char)){
        current.children.set(char, new TrieNode())
      }
      current = current.children.get(char)!;
    }
    current.isEndOfWord = true
    current.word = word
  }

  getSuggestions(word:string): Product[]{
    if(!word || word.trim().length == 0){
      return [];
    }

    const normalizedWord = word.toLowerCase();
    let current : TrieNode = this.root

    for(const char of normalizedWord){
      if(!current.children.has(char)){
        return []
      }
      current = current.children.get(char)!;
    }

    const result: Product[] = []
    this.dfs(current, result)
    return result.slice(0, 10)
  }

  dfs(node: TrieNode, result: Product[]){
    if(node.isEndOfWord && node.word !== null){
      result.push(node.word)
    }

    for (const childNode of node.children.values()){
      this.dfs(childNode, result)
    }
  }
}

const products = JSON.parse(
  fs.readFileSync(__dirname + "/../data/products.json").toString()
);

const search = new Autocomplete()
for (const product of products){
  search.insert(product)
}

export function autocomplete(query: string) {
  return search.getSuggestions(query)
}







