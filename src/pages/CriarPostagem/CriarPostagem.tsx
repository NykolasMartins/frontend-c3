import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";
import { Input } from "../../components/Input/Input";
import ModalSelecionarProduto from "../../components/ModalSelecionarProduto/ModalSelecionarProduto";
import { useEffect, useState } from "react";
import ProdutoCard from "../../components/ProdutoCard/ProdutoCard";
import { type produto } from "../../data/utils";


const schemaCriarCadastro = z.object({
    descricao_produto: z.string(),
    descricao_troca: z.string(),
});

type FormSchema = z.infer<typeof schemaCriarCadastro>;

function CriarPostagem(){
    const navigate = useNavigate();
    const [produtoEscolhido, setProdutoEscolhido] = useState<produto>()
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    
    useEffect(()=>{
        if(localStorage.getItem("token") === null){
            navigate("/login")
            toast.warning("Faça login para ter acesso a essa página!")
        }
    }, [navigate])

    const { 
        register, 
        handleSubmit,
        formState: { errors },
        setValue,
      } = useForm<FormSchema>({
        resolver: zodResolver(schemaCriarCadastro),
        defaultValues: {
            descricao_produto: "", descricao_troca: "",
        }
      });

    const onSubmit = async (data: FormSchema) => {
        const dadosCompletos = {
            ...data,
            idproduto: produtoEscolhido?.id_produto,
            nmProduto: produtoEscolhido?.nm_produto
        };

                    console.log(dadosCompletos)

        try{
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await axios.post(`${API_URL}/produtos/criar_postagem`, dadosCompletos, {
                "headers": {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            })
                console.log("Resposta do servidor:", response.data);

                toast.success("Postagem criada com sucesso!");
                navigate("/", {state: {postagemCriada: true}})

        }
        catch(error){
            console.log("Erro ao enviar dados:", error);
        }


    };

    const onSelecionarProduto = (item:produto) => {
        setProdutoEscolhido(item)
        setValue("descricao_produto", item.ds_produto)
        setIsModalOpen(false)
    }

    const onClose = ()=>{
        setIsModalOpen(false)
    }



    return(
        <form onSubmit={handleSubmit(onSubmit)} className="Formulario">
            <h2 style={{ color: '#3D3468', marginBottom: '20px' }}>Criar Postagem</h2>

            <button className="btnSecundario" type="button" onClick={()=>setIsModalOpen(true)}>
                <p>Selecione o seu Produto</p>
            </button>

            { produtoEscolhido && 
            
            <div style={{alignSelf: "flex-start"}}>

                <ProdutoCard
                    id={produtoEscolhido.id_produto}
                    titulo={produtoEscolhido.nm_produto}
                    franquia={produtoEscolhido.nm_franquia}
                    edicao="Testezin"
                    estado={produtoEscolhido.ds_estado}
                    img_url={produtoEscolhido.imagem}
                    clickable={false}
                />

            </div>

            }

            <Input
            label="Descrição"
            error={errors.descricao_produto}
            placeholder="Digite a descrição"
            {...register("descricao_produto", {required: "Não deixe este campo vazio"})}
            />

            <Input
            label="O que você quer em troca?"
            error={errors.descricao_troca}
            placeholder="Liste pelo o que trocar (Separe por vírgula cada produto diferente)"
            {...register("descricao_troca", {required: "Não deixe este campo vazio"})}
            isTextArea={true}
            />

            <button type="submit" className="btnPadrao">
                <p>Criar Postagem</p>
            </button>

            { isModalOpen &&
            
                <ModalSelecionarProduto onSelecionarProduto={onSelecionarProduto} onClose={onClose} />

            }


        </form>
        
    )
}

export default CriarPostagem;