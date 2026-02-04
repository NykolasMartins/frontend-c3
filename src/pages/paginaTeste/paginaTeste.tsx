import axios from "axios";
import CarouselProdutoCard from "../../components/CarouselProdutoCard/CarouselProdutoCard";
import { useEffect, useState } from "react";



function PaginaTeste(){

    const [produtos, setProdutos] = useState([])

    useEffect(()=>{
        const token = localStorage.getItem('token'); // ou o nome que você usou

        const carregarDados = async () => {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await axios.get(`${API_URL}/auth/principal`, {
                headers: {
                Authorization: `Bearer ${token}`
                }
            });
            setProdutos(response.data.produtos || [])
            console.log(response.data)
        }

        carregarDados();
    
    }, [])
    

    return(
        <div>
            <CarouselProdutoCard
            titulo="Teste"
            produtos={produtos}
            />
        </div>
    )
}


export default PaginaTeste;