import { useNavigate } from 'react-router-dom';
import './ProdutoCard.css'


interface ProdutoCardProps {
  id: number;
  titulo: string;
  franquia: string;
  edicao: string;
  estado: string;
  img_url: string;
  clickable?: boolean;
}

function ProdutoCard({id, titulo, franquia, edicao, estado, img_url, clickable = true}: ProdutoCardProps) {

    const navigate = useNavigate();
    function handleNavigate(){
        navigate(`/detalhes-produto/${id}`)
    }

    // Defina um tipo para os estados possíveis
    type EstadoProduto = 'impecavel' | 'bom' | 'usado' | 'danificado';

    // Tipagem do objeto de mapeamento
    const deParaEstado: Record<EstadoProduto, string> = {
        impecavel: 'Impecável',
        bom: 'Bom',
        usado: 'Usado',
        danificado: 'Danificado'
    };

    const isClickable = clickable ?? true;

    // Se 'estado' vier das props, certifique-se que ele é do tipo EstadoProduto
    const estadoFormatado = deParaEstado[estado as EstadoProduto] || estado;

    return(
        <div className="ProdutoCard" onClick={ isClickable ? ()=>handleNavigate() : ()=>{} }>

            <div className="image-wrapper">
                <img className='image-card' src={img_url} alt="" />
            </div>

            <div className="content-text">
                <p className='card-title'> {titulo} </p>
                <p className='card-text-franquia'> {franquia} </p>
                <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                    <p className='card-text-edicao'> {edicao} </p>
                    <span className={`etiqueta-estado ${estado}`}> {estadoFormatado} </span>
                </div>
            </div>
        </div>
    )
}


export default ProdutoCard;