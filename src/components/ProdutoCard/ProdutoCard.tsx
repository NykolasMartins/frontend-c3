import './ProdutoCard.css'



function ProdutoCard(){



    return(
        <div className="ProdutoCard">

            <div className="image-wrapper">
                <img className='image-card' src="https://i.ebayimg.com/images/g/gwMAAOSwWgVj1x5K/s-l1200.jpg" alt="" />
            </div>

            <div className="content-text">
                <p className='card-title'>Charizard-V (018/159)</p>
                <p className='card-text-franquia'>Pokémon TCG</p>
                <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                    <p className='card-text-edicao'>Realeza Absoluta</p>
                    <span className='etiqueta-estado'>Impecável</span>
                </div>
            </div>
        </div>
    )
}


export default ProdutoCard;