import Slider from "react-slick";
import React, { useState, useEffect } from "react";

// Imports de CSS do Slick (com ignore para evitar erro de TS)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Import do nosso CSS customizado
import "./CarouselSlick.css";
import { Link } from "react-router-dom";

import { itens } from "../../data/subItens";

const itensCarousel = [
  {
    item: itens[0].subItens[0],
  },
  
  {
    item: itens[0].subItens[1],
  },
  {
    item: itens[0].subItens[2],
  },
  {
    item: itens[0].subItens[3],
  },
  {
    item: itens[0].subItens[4],
  },
  {
    item: itens[1],
  },

]


// Setas Customizadas para não usar as padrão feias


export default function Carousel3D() {
  const [itemIndex, setItemIndex] = useState(0);

  // 2. Crie um estado para saber se o componente já "nasceu"
  const [mounted, setMounted] = useState(false); 

  // 3. Use o useEffect para mudar esse estado assim que a tela carregar
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100); // 50ms é imperceptível pro olho, mas suficiente pro React respirar

    return () => clearTimeout(timer);
  }, []);

  const settings = {
    infinite: true,
    lazyLoad: "ondemand" as const,
    speed: 500, // Aumentei um pouco para a transição ser mais elegante
    slidesToShow: 3,
    centerMode: true,
    centerPadding: "0",
    arrows: false,
    
    // --- ADICIONE ESTAS 3 LINHAS ---
    autoplay: true,          // Liga o movimento automático
    autoplaySpeed: 3000,     // Tempo de espera (3000ms = 3 segundos)
    pauseOnHover: true,      // Se o mouse estiver em cima, ele para de rodar (bom para UX)
    // -------------------------------


    beforeChange: (_current: number, next: number) => setItemIndex(next),
  };

  if (!mounted) return null;

  return (
    <div className="carousel-container" >
      <Slider {...settings}>
        {itensCarousel.map((prop, index) => (
          // O activeSlide é usado para estilizar o prop do meio
          <Link to={prop.item.link}>
            <div 
              key={prop.item.id} 
              className={index === itemIndex ? "slide activeSlide" : "slide"}
            >
              <div className={`slide-content`} style={{"--css1": prop.item.c1, "--css2": prop.item.c2} as React.CSSProperties}>
                {prop.item.url && (
                  <img src={prop.item.url} alt="" />
                )}
              </div>
            </div>
          </Link>
        ))}
      </Slider>
    </div>
  );
}