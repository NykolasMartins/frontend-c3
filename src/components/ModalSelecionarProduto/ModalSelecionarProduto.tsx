import { useEffect, useState } from 'react';
import './ModalSelecionarProduto.css'
import ProdutoCard from '../ProdutoCard/ProdutoCard';
import axios from 'axios';
import { FaXmark } from 'react-icons/fa6';

interface produto{
    id_produto: string,
    nm_produto: string,
    nm_franquia: string,
    ds_estado: string,
    imagem: string,
    ds_produto: string,
}

interface modalFunction{
    onSelecionarProduto: (item: produto)=> void
    onClose: ()=>void
}

function ModalSelecionarProduto({ onSelecionarProduto, onClose }: modalFunction){
    const [produtos, setProdutos] = useState<produto[]>([])


     useEffect(()=>{
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const carregarDados = async () => {
                const response = await axios.get(`${API_URL}/produtos/selecionar_postagem`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                })
                console.log(response.data)
                setProdutos(response.data)
            }
            
            carregarDados()
            
            
        }, [])

        


    return(
        <div className="modal-overlay" onClick={onClose}>
            <div className="ModalSelecionarProduto">
                <h2 style={{ color: '#3D3468', marginBottom: '20px' }}>Selecionar Produto</h2>

                <FaXmark size={24} color="#9F8536" style={{position: 'absolute', top: '20px', right: '20px', cursor: 'pointer',}} onClick={onClose} />

                { produtos.length != 0 ?
                <div className='container-grid'>
                    { produtos.map((item) => (
                        <div className="grid-item" key={item.id_produto} onClick={() => onSelecionarProduto(item)}>
                            <ProdutoCard 
                                    titulo={item.nm_produto}
                                    franquia={item.nm_franquia}
                                    edicao="Testezin"
                                    estado={item.ds_estado}
                                    img_url={item.imagem}
                            />
                        </div>
                    ))}
                </div>

                :

                <p style={{fontWeight: "500", color: "#655D41"}}>Nenhum produto encontrado</p>

                }
            </div>
        </div>
    )
}


export default ModalSelecionarProduto;