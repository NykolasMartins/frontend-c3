import './ProdutoCard.css'

interface ProdutoCardProps {
  titulo: string;
  franquia: string;
  edicao: string;
  estado: string;
  img_url: string;
}

function ProdutoCard({titulo, franquia, edicao, estado, img_url}: ProdutoCardProps) {



    return(
        <div className="ProdutoCard">

            <div className="image-wrapper">
                <img className='image-card' src={img_url} alt="" />
            </div>

            <div className="content-text">
                <p className='card-title'> {titulo} </p>
                <p className='card-text-franquia'> {franquia} </p>
                <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                    <p className='card-text-edicao'> {edicao} </p>
                    <span className='etiqueta-estado'> {estado} </span>
                </div>
            </div>
        </div>
    )
}


export default ProdutoCard;