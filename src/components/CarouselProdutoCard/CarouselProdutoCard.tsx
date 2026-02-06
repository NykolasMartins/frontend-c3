import ProdutoCard from "../ProdutoCard/ProdutoCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import './CarouselProdutoCard.css';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// 1. IMPORTAR OS MÓDULOS (Lógica)
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// 2. IMPORTAR OS ESTILOS (Visual)
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


interface Produto {
    id: number,
    nome: string,
    franquia: string,
    edicao: string,
    estado: string,
    img_url: string
}

interface CarouselProps {
    titulo: string,
    produtos: Produto[]

}

function CarouselProdutoCard({titulo, produtos}: CarouselProps){



    return(
        <div className="carousel-produto-container">
            <div className="title-options-wrapper">
                <h4 className="carousel-produto-title">{titulo}</h4>
                <div className="h5-seta-wrapper">
                    <h5 className="carousel-produto-subtitle">Mostrar todas opções</h5>
                    <IoIosArrowForward color="#655D41" className="icon" size={36} />
                </div>
            </div>

            <button className="arrow-left">
                <IoIosArrowBack className="icon" size={48} />
            </button>

            <button className="arrow-right">
                <IoIosArrowForward className="icon" size={48} />
            </button>

            <Swiper 
                    modules={[Navigation, Pagination, Autoplay]}
                    pagination={{ clickable: true }} // Ativa as bolinhas
                    spaceBetween={40}
                    className="mySwiper"

                    navigation={{
                    nextEl: '.arrow-right',
                    prevEl: '.arrow-left',
                    }}

                    breakpoints={{
                        0: {
                            slidesPerView: 'auto', /* Respeita a largura do card */
                            centeredSlides: true,  /* Fica no meio */
                            spaceBetween: 15,
                        },
                    500: { slidesPerView: 2, slidesPerGroup: 2 },
                    768: { slidesPerView: 3, slidesPerGroup: 3 },
                    1024: { slidesPerView: 4, slidesPerGroup: 4 },
                    1280: { slidesPerView: 5, slidesPerGroup: 5 },
                    }}
            >
                { produtos.map((item) => (
                    <SwiperSlide>
                        <ProdutoCard 
                            titulo={item.nome}
                            franquia={item.franquia}
                            edicao="Teste"
                            estado={item.estado}
                            img_url={item.img_url}
                        />
                    </SwiperSlide>

                )) }
            </Swiper>
        
        </div>

            

    )
}

export default CarouselProdutoCard;