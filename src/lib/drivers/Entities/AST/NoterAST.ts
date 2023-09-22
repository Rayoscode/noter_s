interface NoterSymbol {
  symbol: string;
  htmlToRender: (data: any) => string;
  id: string;
}
interface SymbolTable {
  symbols: NoterSymbol[];
}
interface NoterNode {
  id: string;
  symbol: string;
  content: NoterNode[];
  // TODO: Cambiar a la interface de props de css
  customStyle: string;
}
interface NoterAST {
  id: string;
  nodes: NoterNode[];
}
