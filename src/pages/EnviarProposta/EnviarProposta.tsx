import { useState } from "react";
import { FaArrowRightArrowLeft} from "react-icons/fa6";
import { Input } from "../../components/Input/Input";
import { toast } from "sonner";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ProdutoCard from "../../components/ProdutoCard/ProdutoCard";
import './EnviarProposta.css';
import ModalSelecionarProduto from "../../components/ModalSelecionarProduto/ModalSelecionarProduto";
import { mapearParaInterfaceAmigavel, type produto, type Produto } from "../../data/utils";



interface EnviarProposta {
  descricao_proposta: string,
  id_postagem_solicitada: number,
  id_produto_ofertado: number
}


function EnviarProposta(){    

    const [produtoEscolhido, setProdutoEscolhido] = useState<Produto>()

    const { 
        register, 
        handleSubmit,
        formState: { errors },
      } = useForm<EnviarProposta>();

    const navigate = useNavigate();
    const location = useLocation();
    const product: Produto = location.state
    


  const onSubmit = async (data: EnviarProposta) => {

    const dadosCompletos = {
        ...data,
      id_postagem_solicitada: product.idpostagem,
      id_produto_ofertado: produtoEscolhido?.id
    };

    

    try{
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.post(`${API_URL}/produtos/enviar_proposta`, dadosCompletos,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      )
      const result = response.data
      if (result.status == "sucesso"){
        navigate('/', {state: {propostaEnviada: true}})
        window.location.reload()
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(error: any){
      if (error.response) {
        console.log("Status:", error.response.status); 
        console.log("Mensagem do Backend:", error.response.data);
        if (error.response.status === 401) {
             toast.error("Erro de autenticação. Faça login novamente.");
        } else {
             toast.error("Erro no servidor.");
        }
      } else {
          console.log("Erro de conexão:", error.message);
          toast.error("Sem conexão com o servidor.");
      }
    }
  };

  const onSelecionarProduto = (item:produto) => {
        setProdutoEscolhido(mapearParaInterfaceAmigavel(item))
    }

    const onClose = (e?: React.MouseEvent<HTMLButtonElement>)=>{
      e?.preventDefault();
      e?.stopPropagation();
        navigate(`/detalhes-produto/${product.id}`)
    }


    

    return(

    <form onSubmit={handleSubmit(onSubmit)} className="Formulario" >
    
      <h2 style={{ color: '#3D3468', marginBottom: '20px' }}>Enviar Proposta</h2>

      <div style={{width: "100%", display: "flex", gap: "10px", alignItems: "center", justifyContent:"space-evenly"}}>
        <div style={{display: "flex", flexDirection:"column", gap: "10px"}}>
            <p className="subtitle-p">Enviando proposta para:</p>
            <ProdutoCard 
                id={product.id}
                titulo={product.nome}
                franquia={product.franquia}
                edicao={product.edicao}
                estado={product.estado}
                img_url={product.img_url}
                clickable={false}
            />
        </div>

            <FaArrowRightArrowLeft color='#3D3468' size={48} />

        <div style={{display: "flex", flexDirection:"column", gap: "10px"}}>
            <p className="subtitle-p">Oferecendo:</p>
            {
              !produtoEscolhido ?

              (
                <ModalSelecionarProduto onSelecionarProduto={onSelecionarProduto} onClose={onClose} />
              ) : (
                <ProdutoCard 
                    id={produtoEscolhido?.id}
                    titulo={produtoEscolhido?.nome}
                    franquia={produtoEscolhido?.franquia}
                    edicao={produtoEscolhido.edicao}
                    estado={produtoEscolhido.estado}
                    img_url={produtoEscolhido.img_url}
                    clickable={false}
                    
                />
              )
            }
            
        </div>
      </div>

        <Input
        label="Descrição"
        error={errors.descricao_proposta}
        obrigatory={true}
        placeholder="Mande um recado justificando a proposta"
        {...register("descricao_proposta", {required: "Não deixe este campo vazio"})}
        isTextArea={true}
        />

        <button type="submit" className="btnPadrao">
            <p>Enviar</p>
        </button>

    </form>
    )
}

export default EnviarProposta;