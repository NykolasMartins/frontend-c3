
import { Input } from "../../components/Input/Input";

import { useForm } from "react-hook-form";
import { literal, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import './EsqueceuSenha.css'
import { useNavigate } from "react-router-dom";


const schemaEnviarCodigo = z.object({
    email: z.string().email("Digite um e-mail válido").or(literal("")),
    telefone: z.string().min(14, "O telefone está incompleto").or(literal("")),
})

type FormSchema = z.infer<typeof schemaEnviarCodigo>;




function EsqueceuSenha() {

    const [marcado, setMarcado] = useState<boolean>(false)

    const navigate = useNavigate();


    const { 
    register, 
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(schemaEnviarCodigo),
    defaultValues: {
        email: "", telefone:""
    }
  });

  async function onSubmit(data: FormSchema){
    try{
        const dadosCompletos = { ...data, marcado }
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await axios.post(`${API_URL}/auth/esqueci_senha`, dadosCompletos)
        console.log(response.data)
        localStorage.setItem('tokenVerificaCodigo', response.data.token)
        navigate('/esqueceu-senha/enviar-codigo')
    }   
    catch(error){
        console.log(error)
    }
    
    
  }


    return(
        <form onSubmit={handleSubmit(onSubmit)} className="Formulario">
            <h2 style={{ color: '#3D3468', marginBottom: '20px' }}>Esqueceu a senha?</h2>

            <p style={{color:"#615110"}}>Escolha o metódo de verificação por código</p>

            <div style={{display:"flex", width:"fit-contente", gap:"50px", justifyContent:"space-between"}}>
                <button className={marcado ? "botaoEscolha" : "botaoEscolha ativo"} type="button" onClick={()=> setMarcado(false)}>Telefone</button>
                <button className={marcado ? "botaoEscolha ativo" : "botaoEscolha"} type="button" onClick={()=> setMarcado(true)}>Email</button>
            </div>

            {
                marcado

                ?

                <Input 
                    label="E-mail"
                    type="email"
                    placeholder="seu@email.com"
                    error={errors.email}
                    obrigatory={true}
                    {...register("email")}
                />

                :

                <Input 
                    label="Celular / WhatsApp"
                    mask="(99) 99999-9999"
                    placeholder="(00) 00000-0000"
                    error={errors.telefone}
                    obrigatory={true}
                    {...register("telefone")}
                />
            }

            

            <button type="submit" className="btnPadrao">
               <p>Enviar</p>
            </button>
            
        </form>
    )
}



export default EsqueceuSenha;