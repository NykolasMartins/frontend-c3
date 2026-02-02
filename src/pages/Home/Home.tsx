import Carousel3D from '../../components/Carousel3D/Carousel3D'
import './Home.css'
import logoCompleta from '../../assets/logoCompleta.png'


function Home(){

    return(
        <div className='Home'>
            <div style={{width: "100%", display:'flex', justifyContent: "space-between", padding: "0 90px"}}>
                <div style={{display:"flex", flexDirection:"column", alignItems: "center", gap: "30px"}}>
                    <h3 className='homeTitle'>
                        Venha trocar seus <br /> <span>colecionáveis</span> aqui!
                    </h3>
                    <img src={logoCompleta} alt="" className='logoCompleta' />
                </div>
                
                <div style={{width: "800px",  // Exemplo: define um espaço fixo para ele renderizar
                    minHeight: "400px", // Garante que a altura não seja 0
                    display:"block", // Slick prefere block a flex direto no container imediato
                    overflow: "hidden" // Opcional, dependendo do seu design
                    }}>
                    <Carousel3D />
                </div>
            </div>
        </div>
    )
}


export default Home;