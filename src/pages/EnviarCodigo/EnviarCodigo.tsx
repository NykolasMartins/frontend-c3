import axios from "axios";
import { OtpInput } from "../../components/OtpInput/OtpInput";
import { useNavigate } from "react-router-dom";



function EnviarCodigo(){

    const navigate = useNavigate();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function HandleComplete(code:any){
        const CodigoDigitado = {CodigoDigitado: code}
        const token = localStorage.getItem('tokenVerificaCodigo');
        try{
            const response = await axios.post('http://localhost:3000/auth/verifica_codigo', CodigoDigitado, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            console.log(response.data)
            localStorage.removeItem('tokenVerificaCodigo');
            localStorage.setItem('tokenAtualizarSenha', response.data.tokenAtualizarSenha);
            navigate('/esqueceu-senha/nova-senha')
            window.location.reload()
        } catch (error){
            console.log(error)
        }
    }


    return(
            <form className="Formulario">
                 <h2 style={{ color: '#3D3468', marginBottom: '20px' }}>Esqueceu a senha?</h2>
                <OtpInput onComplete={HandleComplete} />
            </form>
    )
}

export default EnviarCodigo;