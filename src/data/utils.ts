export interface produto{
    id_produto: number,
    nm_produto: string,
    nm_franquia: string,
    ds_estado: string,
    imagem: string,
    ds_produto: string,
    nm_edicao: string,
}

export interface Produto {
    id: number,
    nome: string,
    franquia: string,
    edicao: string,
    estado: string,
    img_url: string,
    idpostagem?: number,
}

export const mapearParaInterfaceAmigavel = (p: produto): Produto => {
  return {
    id: p.id_produto,
    nome: p.nm_produto,
    franquia: p.nm_franquia,
    edicao: p.nm_edicao,  // Mapeando a descrição para edição
    estado: p.ds_estado,
    img_url: p.imagem,
  };
};