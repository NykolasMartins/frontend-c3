import { FaPlus } from "react-icons/fa";
import "./MeusDesejos.css";
import { useState } from "react";
import DropzoneInput from "../../components/DropzoneInput/DropzoneInput";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../../components/Input/Input";
import { toast } from "sonner";
import axios from "axios";



const schemaCadastro = z.object({
    nome_desejo: z.string().min(6, "O nome precisa ter pelo menos 6 letras"),
    descricao_desejo: z.string().min(3, "A edição precisa ter pelo menos 3 letras"),
});
type FormSchema = z.infer<typeof schemaCadastro>;




function MeusDesejos() {
    const [isNewWishDelay, setIsNewWishDelay] = useState(false);
    const [isNewWishOpen, setIsNewWishOpen] = useState(false);
    const lidarComArquivos = (arquivosRecebidos: File[]) => {
        console.log("O filho me mandou estes arquivos:", arquivosRecebidos);
    };


    const onSubmit = async (data: FormSchema) => {
    const dadosCompletos = {
        ...data,
    };

      try{
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await axios.post(`${API_URL}/auth/Meus-Desejos`, dadosCompletos)
        if(response.data.status === "sucesso"){
          toast.success("Cadastro realizado com sucesso!");
        }
      }
      catch(error){
        console.log("Erro ao enviar dados:", error);
      }


  };

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<FormSchema>({
        resolver: zodResolver(schemaCadastro),
        defaultValues: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            nome_desejo: "", descricao_desejo: ""
        }
    });


    return (

        <div className="MeusDesejos">
            <div className={ isNewWishOpen ? "new-wish open" : "new-wish"}>
                <h2 >Novo Desejo!</h2>
                {isNewWishDelay ? (
                    
                        <form onSubmit={handleSubmit(onSubmit)} className="form-Wish">
                        <DropzoneInput onFileChange={lidarComArquivos} initialPreviews={[]} />

                        <Input
                            label="Nome"
                            error={errors.nome_desejo}
                            isTextArea={false}
                            placeholder="Nome do desejo"
                            {...register("nome_desejo", { required: "Não deixe este campo vazio" })}
                        />
                        <Input
                            label="Descrição"
                            error={errors.descricao_desejo}
                            isTextArea={true}
                            placeholder="Descreva seu desejo"
                            {...register("descricao_desejo", { required: "Não deixe este campo vazio" })}
                        />
                        <button className="btnPadrao" type="submit"> <p>Criar</p> </button>
                            
                    </form>
                    
                    
                ) : (
                    <div className={isNewWishOpen ? "btn-new-wish open" : "btn-new-wish"} onClick={() => { setIsNewWishOpen(true);setTimeout(() => { setIsNewWishDelay(true); }, 500); }}>
                        <FaPlus className="plus-icon" />
                    </div>
                )}
            </div>


            <div className= {isNewWishOpen ? "wish-list open" : "wish-list"}>

                <h2 >Lista de desejos:</h2>

                <div className="array">
                    <div className="produt-test">
                        <div className="img">
                            <img className="imgson" src="https://ichef.bbci.co.uk/ace/ws/640/cpsprodpb/6192/live/61bb3530-f641-11ee-91c5-c92e09ae6ba7.jpg.webp" alt="ERRO!" />
                        </div>
                        <div className="txt-name-product">
                            <p className="name-product">LUAZONA-BRABA!!!</p>
                            <p className="post">postagens</p>
                        </div>
                    </div>

                    

                </div>
            </div>
        </div>


    )

}

export default MeusDesejos;