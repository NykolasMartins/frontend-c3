import { useState } from "react";
import "./DetalhesProduto.css"
import { HiHeart, HiOutlineHeart } from "react-icons/hi2";
import { FaStar } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";


function DetalhesProduto() {

    const [isFavorited, setIsFavorited] = useState(false);

    const lista = [
        {
            id: 1,
            link: "https://photos.enjoei.com.br/carta-pokemon-ho-oh-ex-110130393/1200xN/czM6Ly9waG90b3MuZW5qb2VpLmNvbS5ici9wcm9kdWN0cy8xMzY5MzQ2OC85YjMxODZjYzJmYTRjNTU3NDdkMzY4ZmY2ZjQ1NDA0OC5qcGc"
        },
        {
            id: 2,
            link: "https://photos.enjoei.com.br/carta-pokemon-ho-oh-ex-110130393/1200xN/czM6Ly9waG90b3MuZW5qb2VpLmNvbS5ici9wcm9kdWN0cy8xMzY5MzQ2OC8wYTc2MzRmNTA5OTFmZGYxZjk5ZmE3NzA4MjhiYWE5NS5qcGc"
        },
        {
            id: 3,
            link: "https://photos.enjoei.com.br/carta-pokemon-ho-oh-ex-110130393/1200xN/czM6Ly9waG90b3MuZW5qb2VpLmNvbS5ici9wcm9kdWN0cy8xMzY5MzQ2OC84NzcxYTAxMGM2NjlhNWM4YjA2MDJlOTVmMGY4NGI2MC5qcGc"
        },
        {
            id: 4,
            link: "https://photos.enjoei.com.br/carta-pokemon-ho-oh-ex-110130393/1200xN/czM6Ly9waG90b3MuZW5qb2VpLmNvbS5ici9wcm9kdWN0cy8xMzY5MzQ2OC8wYTc2MzRmNTA5OTFmZGYxZjk5ZmE3NzA4MjhiYWE5NS5qcGc"
        },
    ]

    const desejo = "Blastoise V (SWSH101), Venusaur V (SWSH100), Pikachu ex (057/191), Cards de One Piece Two Legends"

    const desejo_formatado = desejo.split(",");
    


    return(
        <div className="DetalhesProduto">
            <div className="product-gallery">
                <div className="main-image">
                    <img src="https://photos.enjoei.com.br/carta-pokemon-ho-oh-ex-110130393/800x800/czM6Ly9waG90b3MuZW5qb2VpLmNvbS5ici9wcm9kdWN0cy8xMzY5MzQ2OC85YjMxODZjYzJmYTRjNTU3NDdkMzY4ZmY2ZjQ1NDA0OC5qcGc" alt="" />
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
                        <h1 className="title">Carta Pokémon Ho-Oh EX</h1>
                        <h3 className="subtitle">Realeza Absoluta</h3>
                    </div>

                    <div className="description">
                        <p>
                            Ho-Oh EX é uma carta de Pokémon do tipo Fogo, conhecida por sua majestade e poder. Com um design vibrante e habilidades impressionantes, esta carta é altamente valorizada pelos colecionadores e jogadores. Ho-Oh EX possui ataques poderosos que podem causar danos significativos aos oponentes, tornando-a uma escolha estratégica em batalhas de Pokémon. Além disso, sua arte detalhada e cores vibrantes a tornam uma peça de destaque em qualquer coleção de cartas Pokémon.
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
                    
                        <span className="advertiser-location"><p>Santos (SP), Brasil</p></span>
                        <div className="cat-fra-est-wrapper">
                            <p><strong>Categoria:</strong> Card Games</p>
                            <p><strong>Franquia:</strong> Pokemon TCG</p>
                            <p><strong>Estado:</strong> Impecável</p>
                        </div>

                        <div className="btn-wrapper" style={{color: "red"}}>
                            <button className="btnPadrao"><p>Enviar Proposta</p></button>
                            <button className="btn-favorite" onClick={() => setIsFavorited(!isFavorited)}>
                                { isFavorited ? <HiHeart color="#6D664A" size={32} /> : <HiOutlineHeart  color="#6D664A" size={32}  /> }
                            </button>   
                        </div>

                         <p className="advertiser-title">Anunciante</p>
                        <div className="advertiser-review">
                            <div className="advertiser-area">
                                <FaUserCircle size={32} color='#3D3468' />
                                <div className="user-wrapper">
                                    <p className="user-name">@RobertoFarias</p>
                                    <div className="user-review-overall">
                                        <div className="stars">
                                            <FaStar color="#DAB04F" size={16} />
                                            <FaStar color="#DAB04F" size={16} />
                                            <FaStar color="#DAB04F" size={16} />
                                            <FaStar color="#8A9AA7" size={16} />
                                            <FaStar color="#8A9AA7" size={16} />
                                        </div>
                                        <p className="stars-desc"> 3.0 / 5.0</p>
                                    </div>  
                                    <p className="trade-amount">3 Trocas Feitas</p>
                                </div>
                            </div>
                            <span className="separator-line"></span>
                            <div className="user-reviews">
                                <p className="user-reviews-title">Avaliações do anunciante</p>
                                <div className="reviewer-user">
                                    <FaUserCircle size={28} color='#3D3468' />
                                    <div className="username-stars-wrapper">
                                        <p className="user-name">@UserAleatorio345234</p>
                                        <div className="stars">
                                            <FaStar color="#DAB04F" size={14} />
                                            <FaStar color="#DAB04F" size={14} />
                                            <FaStar color="#DAB04F" size={14} />
                                            <FaStar color="#DAB04F" size={14} />
                                            <FaStar color="#8A9AA7" size={14} />
                                        </div>
                                    </div>
                                </div>
                                <div className="reviewer-user">
                                    <FaUserCircle size={28} color='#3D3468' />
                                    <div className="username-stars-wrapper">
                                    <p className="user-name">@UserAleatorio345234</p>
                                        <div className="stars">
                                            <FaStar color="#DAB04F" size={14} />
                                            <FaStar color="#8A9AA7" size={14} />
                                            <FaStar color="#8A9AA7" size={14} />
                                            <FaStar color="#8A9AA7" size={14} />
                                            <FaStar color="#8A9AA7" size={14} />
                                        </div>
                                    </div>
                                </div>
                                <div className="reviewer-user">
                                    <FaUserCircle size={28} color='#3D3468' />
                                    <div className="username-stars-wrapper">
                                        <p className="user-name">@UserAleatorio345234</p>
                                        <div className="stars">
                                            <FaStar color="#DAB04F" size={14} />
                                            <FaStar color="#DAB04F" size={14} />
                                            <FaStar color="#DAB04F" size={14} />
                                            <FaStar color="#DAB04F" size={14} />
                                            <FaStar color="#8A9AA7" size={14} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    )
}


export default DetalhesProduto;