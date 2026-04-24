import { FaPlus } from "react-icons/fa";
import "./MeusDesejos.css";
import { useEffect, useState } from "react";
import DropzoneInput from "../../components/DropzoneInput/DropzoneInput";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../../components/Input/Input";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const schemaCadastro = z.object({
    nome_desejo: z.string().min(6, "O nome precisa ter pelo menos 6 letras").max(25, "O nome pode ter no máximo 25 letras"),
    descricao_desejo: z.string().min(10, "A descrição precisa ter pelo menos 10 letras").optional(),
    file: z.instanceof(File).optional(),
});
type FormSchema = z.infer<typeof schemaCadastro>;

interface desejo {
    id: number,
    nome: string,
    descricao: string,
    img_url: string,
}



function MeusDesejos() {
    const [isNewWishOpen, setIsNewWishOpen] = useState(false);
    const [desejos, setDesejos] = useState<desejo[]>([]);
    const lidarComArquivos = (arquivosRecebidos: File[]) => {
        console.log("O filho me mandou estes arquivos:", arquivosRecebidos);
        setValue("file", arquivosRecebidos[0]);
    };

    const navigate = useNavigate();

    useEffect( () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            toast.error("Faça login para acessar seus desejos!");
            return;
        }

        const fetchDesejos = async () => {
            try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await axios.get(`${API_URL}/desejos/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            })
                    console.log("Desejos do usuário:", response.data);
                    setDesejos(response.data.desejos);
                } catch (error) {
                    console.error("Erro ao buscar desejos do usuário:", error);
                    toast.error("Erro ao buscar desejos do usuário!");
                }
            };
        fetchDesejos();
    }, [navigate]);

     
    const onSubmit = async (data: FormSchema) => {
        const formData = new FormData();

    formData.append('nome_desejo', data.nome_desejo);
    formData.append('descricao_desejo', data.descricao_desejo?.toString() || '');
    if (data.file) {
        formData.append('imagem_desejo', data.file); 
    }
    

      try{
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await axios.post(`${API_URL}/desejos/cadastrar`, formData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
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
        setValue,
    } = useForm<FormSchema>({
        resolver: zodResolver(schemaCadastro),
        defaultValues: {
            nome_desejo: "", descricao_desejo: ""
        }
    });


    return (

        <div className="MeusDesejos">
            <div className={ isNewWishOpen ? "new-wish open" : "new-wish"}>
                <h2 >Novo Desejo!</h2>
                {isNewWishOpen ? (
                    
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
                    <div className={isNewWishOpen ? "btn-new-wish open" : "btn-new-wish"} onClick={() => { setIsNewWishOpen(true) }}>
                        <FaPlus className="plus-icon" />
                    </div>
                )}
            </div>


            <div className= {isNewWishOpen ? "wish-list open" : "wish-list"}>

                <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center"}}>
                    <h2>Lista de desejos:</h2>
                    {isNewWishOpen && (
                        <p onClick={() => { setIsNewWishOpen(false) }}>Ver mais...</p>
                    )}
                </div>

                
                <div className="array">
                    { Array.isArray(desejos) && desejos.map((desejo) => (
                        <div className="produt-test" key={desejo.id}>
                            <div className="img">
                                <img className="imgson" src={desejo.img_url} alt="ERRO!" />
                            </div>
                            <div className="txt-name-product">
                                <p className="name-product">{desejo.nome}</p>
                                <p className="post">0 postagens</p>
                            </div>
                        </div>
                    ) ) }
                    
                    
                </div>
            </div>
        </div>


    )

}

export default MeusDesejos;