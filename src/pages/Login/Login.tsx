import { useForm } from "react-hook-form";
import { useState } from "react";
import { Input } from "../../components/Input/Input";
import { toast } from "sonner";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

interface LoginForm {
  usuario: string;
  senha: string;
}





function Login() {

  const [passwordVisible, setPasswordVisible] = useState(false);

  

  
  const { 
    register, 
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const navigate = useNavigate();


  const onSubmit = async (data: LoginForm) => {
    const dadosCompletos = {
        ...data,
    };

    try{
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.post(`${API_URL}/auth/login`, dadosCompletos)
      const result = response.data
      console.log(result)
      if (result.status == "sucesso"){
        console.log("Logado com Sucesso")
        localStorage.setItem('token', result.token)
        navigate('/')
        window.location.reload()
        toast.success("Login realizado com sucesso!");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(error: any){
      if (error.response) {
        console.log("Status:", error.response.status); 
        console.log("Mensagem do Backend:", error.response.data);
        if (error.response.status === 401) {
             toast.error("Usuário ou senha incorretos.");
        } else {
             toast.error("Erro no servidor.");
        }
      } else {
          console.log("Erro de conexão:", error.message);
          toast.error("Sem conexão com o servidor.");
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const respostaGoogle = async (credentialResponse: any) => {
    const tokenGoogle = credentialResponse.credential;
    

    const dadosUsuario = jwtDecode(tokenGoogle);
    console.log(dadosUsuario);

    try {
        const resposta = await axios.post('http://localhost:3000/auth/login-google', {
            token: tokenGoogle,
        });

        console.log(resposta.data);

        if (resposta.data.registrado === true){
          localStorage.setItem('token', resposta.data.token);
          
          navigate('/')
          window.location.reload()
          toast.success("Bem-vindo de Volta");
        }
        else {
        navigate('/cadastro',{
          state: {
            fromGoogleLogin: true,
            nome: resposta.data.nome,
            email: resposta.data.email,
          }
        });
      }
        
    } catch (erro) {
        console.log("Erro no login google", erro);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="Formulario" >
      <h2 style={{ color: '#3D3468', marginBottom: '20px' }}>Login</h2>

        <Input
        label="E-mail, CPF ou Usuário"
        error={errors.usuario}
        obrigatory={true}
        placeholder="Digite seu e-mail, CPF ou usuário"
        {...register("usuario", {required: "Não deixe este campo vazio"})}
        />

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

        <div className="wrapper-entrarbtn-google" style={{display:"flex", alignItems:"center", justifyContent:"center", width:"100%", gap:"30px"}}>
          <button type="submit" className="btnPadrao">
            <p>Entrar</p>
          </button>
            <div style={{marginTop:"20px"}}>
              <GoogleLogin
                onSuccess={respostaGoogle}
                onError={() => {
                  console.log('Login Falhou');
                }}
                useOneTap={false}
                shape="rectangular"  
                size="large"  
                text="continue_with"  
                width="200"
                theme="outline"
              />
            </div>
        </div>

        <div style={{display:"flex", justifyContent:"space-between", width:"100%", fontSize:"14px", marginTop:"10px"}}>
          <p className="pLink" onClick={() => navigate('/esqueceu-senha')}>Esqueci minha senha</p>
          <Link to="/cadastro"><p className="pLink">Fazer cadastro</p></Link>
        </div>
    </form>
  )
}

export default Login