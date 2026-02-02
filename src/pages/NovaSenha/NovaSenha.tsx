import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Input } from "../../components/Input/Input";


const schemaEnviarCodigo = z.object({
    senha: z.string()
    .min(6, "Mínimo 6 caracteres")
    .regex(/[A-Z]/, "Precisa de 1 letra maiúscula")
    .regex(/[a-z]/, "Precisa de 1 letra minúscula")
    .regex(/[0-9]/, "Precisa de 1 número")
    .regex(/[^a-zA-Z0-9]/, "Precisa de 1 caractere especial"),
    confirmar_senha: z.string()
}) .refine((data)=> data.senha === data.confirmar_senha, {
        message: "As senhas não coincidem",
        path: ["confirmar_senha"]
    })

type FormSchema = z.infer<typeof schemaEnviarCodigo>;


function NovaSenha() {

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordVisible2, setPasswordVisible2] = useState(false);
    const navigate = useNavigate()

    

 const { 
    register, 
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(schemaEnviarCodigo),
    defaultValues: {
        senha: ""
    }
  });

  async function onSubmit(data: FormSchema){
    try{const token = localStorage.getItem('tokenAtualizarSenha');
        const dadosCompletos = { ...data}
        const NovaSenha = { NovaSenha: dadosCompletos.senha}
        console.log(NovaSenha)
        const response = await axios.post("http://localhost:3000/auth/atualizar_senha", NovaSenha, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        console.log(response.data)
        navigate('/login')
    }   
    catch(error){
        console.log(error)
    }
}

    return(
        <form className="Formulario" onSubmit={handleSubmit(onSubmit)}>
            <h2 style={{ color: '#3D3468', marginBottom: '20px' }}>Nova Senha</h2>

            <div className="senhaInput" style={{display:'flex', width:'100%', position:'relative', alignItems:'center'}}>
                      <Input 
                        label="Senha"
                        type={passwordVisible ? 'text' : 'password'}
                        placeholder="Digite sua senha"
                        error={errors.senha}
                        obrigatory={true}
                        {...register("senha", {required: "Não deixe este campo vazio"})}
                      />
                      {passwordVisible ? (
                          <FaEye className="olho" onClick={()=>setPasswordVisible(false)}/>
                      ) : (
                          <FaEyeSlash className="olho" onClick={()=>setPasswordVisible(true)}/>
                      )}
            </div>

            <div className="senhaInput" style={{display:'flex', width:'100%', position:'relative', alignItems:'center'}}>
                      <Input 
                        label="Confirmar senha"
                        type={passwordVisible2 ? 'text' : 'password'}
                        placeholder="Digite sua senha"
                        error={errors.confirmar_senha}
                        obrigatory={true}
                        {...register("confirmar_senha", {required: "Não deixe este campo vazio"})}
                      />
                      {passwordVisible2 ? (
                          <FaEye className="olho" onClick={()=>setPasswordVisible2(false)}/>
                      ) : (
                          <FaEyeSlash className="olho" onClick={()=>setPasswordVisible2(true)}/>
                      )}
            </div>

            <button type="submit" className="btnPadrao">
               <p>Enviar</p>
            </button>
        </form>
    )
}


export default NovaSenha;