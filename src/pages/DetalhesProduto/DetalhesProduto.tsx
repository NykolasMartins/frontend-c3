import { useEffect, useState } from "react";
import "./DetalhesProduto.css"
import { HiHeart, HiOutlineHeart } from "react-icons/hi2";
import { FaStar, FaStarHalf } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";


function DetalhesProduto() {

    // Defina um tipo para os estados possíveis
    type EstadoProduto = 'impecavel' | 'bom' | 'usado' | 'danificado';

    // Tipagem do objeto de mapeamento
    const deParaEstado: Record<EstadoProduto, string> = {
        impecavel: 'Impecável',
        bom: 'Bom',
        usado: 'Usado',
        danificado: 'Danificado'
    };

   

    

    interface userAvaliation {
        id_avaliador: number;
        nome_avaliador: string;
        estrelas: number;
        comentario: string;
    }

    interface ProductInfo {
        id: number;
        produto: string;
        edicao: string;
        descricao: string;
        estado: string;
        franquia: string;
        categoria: string;
        id_usuario: number;
        lista_imagens: string;
        idpostagem: number;
        emtroca: string;
        cidade: string;
        uf: string;

        nome_anunciante: string;
        media_estrelas: number;
        quantidade_trocas: number;
        
        lista_avaliacoes: userAvaliation[];
    }

    const [productInfo, setProductInfo] = useState<ProductInfo | null>(null)
    const {product_id} = useParams();
    const [estadoFormatado, setEstadoFormatado] = useState<EstadoProduto>('bom');

    useEffect(()=>{

        async function fetchProductDetails(){
            try{
                const token = localStorage.getItem('token');
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
                const response = await axios.post(`${API_URL}/produtos/exibir_detalhe`, { id_produto: product_id }, {
                        headers: {
                        Authorization: `Bearer ${token}`
                        }
                    });
                console.log(response.data);
                setProductInfo(response.data)

                 // Se 'estado' vier das props, certifique-se que ele é do tipo EstadoProduto
                const estadoFormatado = deParaEstado[response.data.estado as EstadoProduto] || response.data.estado;
                setEstadoFormatado(estadoFormatado);

            } catch(error){
                console.log(error)
            }
        }

        fetchProductDetails();
        


    }, [product_id])
    
    useEffect(() => {
    async function fetchUserDetails() {

        if (!productInfo?.id_usuario) return;
        
        try {
            const token = localStorage.getItem('token');
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await axios.post(`${API_URL}/produtos/exibir_anunciante`, { id_usuario: productInfo?.id_usuario }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            setProductInfo(estadoAnterior => {
                // Se por algum motivo o estado sumiu, não faz nada
                if (!estadoAnterior) return estadoAnterior; 

                // Retorna um objeto novo misturando os dois!
                return {
                    ...estadoAnterior,  // Mantém: id, produto, edicao, imagens, etc...
                    ...response.data    // Adiciona: nome_anunciante, media_estrelas, lista_avaliacoes...
                };
            });
        }   catch (error) {
            console.log(error);
        }
    }

    fetchUserDetails();

}, [productInfo?.id_usuario]);

    const [isFavorited, setIsFavorited] = useState(false);

    const lista = productInfo?.lista_imagens.split(", ").map((link, index) => ({ id: index, link: link })) || [];

    const desejo = productInfo?.emtroca || ""

    const desejo_formatado = desejo.split(",");

    const navigate = useNavigate(); 

    const product = {id: productInfo?.id, id_postagem: productInfo?.idpostagem, nome: productInfo?.produto, franquia: productInfo?.franquia, edicao: productInfo?.edicao, estado: productInfo?.estado, img_url: lista[0]?.link, idpostagem: productInfo?.idpostagem , clickable: false}
    
    

    const navigateProposta = ()=>{navigate("/enviar-proposta", {state: product})}

    
    

    return(
        <div className="DetalhesProduto">
            <div className="product-gallery">
                <div className="main-image">
                    <img src={lista[0]?.link} alt="" />
                </div>

                <div className="secondary-images">
                    { lista.map((item)=>(
                        <div className="image" key={item.id}>
                            <img src={item.link} alt="" />
                        </div>
                    )) }
                </div>
            </div>

            <div className="product-details">
                <div className="product-header">
                    <div className="title-subtitle-wrapper">
                        <h1 className="title">{productInfo?.produto}</h1>
                        <h3 className="subtitle">{productInfo?.edicao}</h3>
                    </div>

                    <div className="description">
                        <p>
                            {productInfo?.descricao}
                        </p>
                    </div>
                </div>

                <div className="trade-wishlist">
                    <h3>Busca em troca:</h3>
                    <ul className="wishlist-container">
                        { desejo_formatado.map((item)=>(
                            <li>{item}</li>
                        )) }
                    </ul>
                </div>

                
            </div>

            <div className="advertiser-info">
                <div className="advertiser-meta">
                    
                        <span className="advertiser-location"><p>{productInfo?.cidade} ({productInfo?.uf.toUpperCase()}), Brasil</p></span>
                        <div className="cat-fra-est-wrapper">
                            <p><strong>Categoria:</strong> {productInfo?.categoria}</p>
                            <p><strong>Franquia:</strong> {productInfo?.franquia}</p>
                            <p><strong>Estado:</strong> {estadoFormatado}</p>
                        </div>

                        <div className="btn-wrapper" style={{color: "red"}}>
                            <button className="btnPadrao" onClick={navigateProposta}><p>Enviar Proposta</p></button>
                            <button className="btn-favorite" onClick={() => setIsFavorited(!isFavorited)}>
                                { isFavorited ? <HiHeart color="#6D664A" size={32} /> : <HiOutlineHeart  color="#6D664A" size={32}  /> }
                            </button>   
                        </div>

                         <p className="advertiser-title">Anunciante</p>
                        <div className="advertiser-review">
                            <div className="advertiser-area">
                                <FaUserCircle size={32} color='#3D3468' />
                                <div className="user-wrapper">
                                    <p className="user-name">@{productInfo?.nome_anunciante}</p>
                                    <div className="user-review-overall">
                                        <div className="stars">
                                                    {Array.from({ length: 5 }).map((_, index) => {
                                                        // Aqui o TS já sabe que productInfo existe!
                                                        const nota = productInfo?.media_estrelas || 0; 
                                                        
                                                        if (nota >= index + 1) return <FaStar key={index} color="#DAB04F" size={16} />;
                                                        if (nota >= index + 0.5) return <div key={index}> <FaStarHalf color="#DAB04F" style={{zIndex:1, position: "absolute"}} size={16} /> <FaStar color="#8A9AA7" style={{zIndex:0}} size={16} /></div>;
                                                        return <FaStar key={index} color="#b2b9c0" size={16} />;
                                                    })}
                                                </div>
                                        <p className="stars-desc"> {productInfo?.media_estrelas} / 5.0</p>
                                    </div>  
                                    <p className="trade-amount">{productInfo?.quantidade_trocas} Trocas Feitas</p>
                                </div>
                            </div>
                            <span className="separator-line"></span>
                            <div className="user-reviews">
                                <p className="user-reviews-title">Avaliações do anunciante</p> 
                                    {

                                    !productInfo?.lista_avaliacoes || productInfo.lista_avaliacoes.length === 0

                                    ?
                                    
                                    <p style={{color:"#6D664A", fontWeight:"500"}}>Esse anunciante ainda não possui avaliações.</p>

                                    :
                                    
                                    productInfo?.lista_avaliacoes.map((avaliacao) => (
                                        <div className="reviewer-user" key={avaliacao.id_avaliador}>
                                        <FaUserCircle size={28} color='#3D3468' />
                                            <div className="username-stars-wrapper">
                                                <p className="user-name">@{avaliacao.nome_avaliador}</p>
                                                <div className="stars">
                                                    {Array.from({ length: 5 }).map((_, index) => {
                                                        // Aqui o TS já sabe que productInfo existe!
                                                        const nota = avaliacao.estrelas || 0; 
                                                        
                                                        if (nota >= index + 1) return <FaStar key={index} color="#DAB04F" />;
                                                        if (nota >= index + 0.5) return <div key={index}> <FaStarHalf color="#DAB04F" style={{zIndex:1, position: "absolute"}} /> <FaStar color="#8A9AA7" style={{zIndex:0}} /></div>;
                                                        return <FaStar key={index} color="#b2b9c0" />;
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                    
                                )}
                                
                            </div>
                        </div>
                </div>
            </div>
        </div>
    )
}


export default DetalhesProduto;