import Carousel3D from '../../components/Carousel3D/Carousel3D'
import './Home.css'
import logoCompleta from '../../assets/logoCompleta.png'
import CarouselProdutoCard from '../../components/CarouselProdutoCard/CarouselProdutoCard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { toast } from 'sonner';


function Home(){

    const [produtos, setProdutos] = useState([])

    useEffect(()=>{
        const token = localStorage.getItem('token'); // ou o nome que você usou

        const carregarDados = async () => {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await axios.get(`${API_URL}/auth/principal`, {
                headers: token ? {
                    Authorization: `Bearer ${token}`
                } : {}
            });
            setProdutos(response.data.produtos || [])
            console.log(response.data)
        }

        carregarDados();
    
    }, [])

    const location = useLocation();

    useEffect(() => {

        if (location.state?.propostaEnviada) {
            toast.success("Proposta realizada com sucesso!");
            // Limpa o estado para o toast não aparecer de novo no próximo refresh
            window.history.replaceState({}, document.title);
        }

        if (location.state?.loginSucesso) {
            toast.success("Login realizado com sucesso!");
            // Limpa o estado para o toast não aparecer de novo no próximo refresh
            window.history.replaceState({}, document.title);
        }

        if (location.state?.cadastroSucesso) {
            toast.success("Cadastro realizado com sucesso!");
            // Limpa o estado para o toast não aparecer de novo no próximo refresh
            window.history.replaceState({}, document.title);
        }

        if (location.state?.produtoCadastrado) {
            toast.success("Produto cadastrado com sucesso!");
            // Limpa o estado para o toast não aparecer de novo no próximo refresh
            window.history.replaceState({}, document.title);
        }

        if (location.state?.postagemCriada) {
            toast.success("Postagem criada com sucesso!");
            // Limpa o estado para o toast não aparecer de novo no próximo refresh
            window.history.replaceState({}, document.title);
        }

    }, [location]);


    return(
        <div className='Home'>
            <div className='title-carousel-wrapper'>
                <div className='title-logo-wrapper'>
                    <h3 className='homeTitle'>
                        Venha trocar seus <br /> <span>colecionáveis</span> aqui!
                    </h3>
                    <img src={logoCompleta} alt="" className='logoCompleta' />
                </div>
                
                <div className='carousel-div'>
                    <Carousel3D />
                </div>
            </div>

            <div style={{
                width: "100%", 
                padding: "0 20px", /* 1. Adicionado o mesmo padding do topo para alinhar */
                marginTop: "50px", /* 2. Espaço para não colar no de cima */
                position: "relative", /* 3. Garante contexto de posicionamento */
                zIndex: 10 /* 4. Garante que fique por cima de qualquer fundo */
            }}>
                <CarouselProdutoCard
                titulo="Geral"
                produtos={produtos}
                />
            </div>
        </div>
    )
}


export default Home;