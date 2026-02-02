import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { literal, z } from "zod";
import { Input } from "../../components/Input/Input";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { SelectInput } from "../../components/Input/SelectInput"; 
import axios from "axios";
import { type SingleValue, type MultiValue } from "react-select";
import { toast } from "sonner";
import { Link, useLocation, useNavigate } from "react-router-dom"

// --- TIPAGENS ---
interface IBGEResponse {
  id: number;
  sigla: string;
  nome: string;
}

// Essa é a interface que vamos usar para substituir o 'any' nos selects
interface OptionType {
  label: string;
  value: string;
}

// 1. AS REGRAS (Schema do Zod)
const schemaCadastro = z.object({
  nome: z.string().min(3, "O nome precisa ter pelo menos 3 letras"),
  nome_exibicao: z.string().min(3, "O nome de exibição precisa ter pelo menos 3 caracteres"),
  email: z.string().email("Digite um e-mail válido"),
  telefone: z.string().min(14, "O telefone está incompleto"),
  cpf: z.string().min(14, "CPF inválido"),
  
  senha: z.string()
    .min(6, "Mínimo 6 caracteres")
    .regex(/[A-Z]/, "Precisa de 1 letra maiúscula")
    .regex(/[a-z]/, "Precisa de 1 letra minúscula")
    .regex(/[0-9]/, "Precisa de 1 número")
    .regex(/[^a-zA-Z0-9]/, "Precisa de 1 caractere especial"),

  cep: z.string().min(9, "CEP inválido").or(literal('')),

  logradouro: z.string().optional(),
  bairro: z.string().optional(),
});

type FormSchema = z.infer<typeof schemaCadastro>;

function Cadastro() {

  const location = useLocation();

  // Estados visuais
  const [ufSelecionada, setUfSelecionada] = useState<OptionType | null>(null);
  const [cidade, setCidade] = useState<OptionType | null>(null);
  
  const [ufOpcoes, setUfOpcoes] = useState<OptionType[]>([]);
  const [cidadeOpcoes, setCidadeOpcoes] = useState<OptionType[]>([]);
  
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [cepPreenchido, setCepPreenchido] = useState(false)

  const navigate = useNavigate();

  // 2. O GERENTE (useForm)
  const { 
    register, 
    handleSubmit,
    formState: { errors },
    control,    // <--- 1. IMPORTANTE: Precisamos vigiar o CEP
    setValue, // <--- 2. IMPORTANTE: Para preencher Rua e Bairro
  } = useForm<FormSchema>({
    resolver: zodResolver(schemaCadastro),
    defaultValues: {
        nome: "", email: "", telefone: "", cpf: "", senha: "", logradouro: "", bairro: ""
    }
  });

  const cepDigitado = useWatch({
    control,
    name: "cep",
  });



  // [PASSO 2, 3, 4, 5 e 6] A LÓGICA DO CEP
  useEffect(() => {
    // Limpeza: Remove traços e pontos, deixa só números (Ex: "01001-000" vira "01001000")
    const cepLimpo = cepDigitado?.replace(/\D/g, '');

    // Gatilho: Só roda se tiver exatamente 8 números
    if (cepLimpo?.length === 8) {
        
        // Chamada API
        axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`)
        .then(response => {
            if (response.data.erro) {
                toast.warning("CEP não encontrado!");
                return;
            }

            // Desestruturação: Pega os dados que vieram do correio
            const { logradouro, bairro, localidade, uf } = response.data;

            // [PASSO 4] Preenche os Inputs de Texto
            setValue("logradouro", logradouro); // Escreve a Rua
            setValue("bairro", bairro);         // Escreve o Bairro

            // [PASSO 5] Preenche a Cidade (Fácil)
            // Criamos o objeto {label, value} na hora e jogamos no estado
            setCidade({ label: localidade, value: localidade });

            // [PASSO 6] Preenche o Estado (Difícil)
            // O ViaCEP devolve "SP", mas o Select precisa do objeto completo da lista.
            // Procuramos na lista 'ufOpcoes' quem tem o value igual a "SP"
            const estadoEncontrado = ufOpcoes.find(item => item.value === uf);
            
            if (estadoEncontrado) {
                setUfSelecionada(estadoEncontrado);
            }

            setCepPreenchido(true)
            toast.success("Cep Encontrado!")
        })
        .catch(err => console.error("Erro no CEP:", err));
    }
    
  }, [cepDigitado, ufOpcoes]); // Roda sempre que o CEP ou a lista de estados mudar



  // --- BUSCA DOS ESTADOS ---
  useEffect(() => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
    .then(response => {
      setUfOpcoes(response.data.map((uf: IBGEResponse) => ({
        label: uf.nome, 
        value: uf.sigla
      })));
    });

    

    const { nome, email } = location.state || {};
    setValue("nome", nome || "");
    setValue("email", email || "");

  setValue("nome_exibicao", nome ? `@${nome.replace(/\s+/g, '').toLowerCase()}` : "");

  }, []);

  // --- BUSCA DAS CIDADES ---
  useEffect(() => {
    if (!ufSelecionada) return;

    axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufSelecionada.value}/municipios`)
    .then(response => {
      setCidadeOpcoes(response.data.map((city: { nome: string }) => ({
        label: city.nome, 
        value: city.nome
      })));
    });
  }, [ufSelecionada]);


  const onSubmit = async (data: FormSchema) => {
    const dadosCompletos = {
        ...data,
        nome_exibicao: data.nome_exibicao.replace(/@/g, ''),
        bairro: data.bairro || '',
        logradouro: data.logradouro || '',
        uf: ufSelecionada?.value || '', 
        cidade: cidade?.value || '',
    };

      try{
        const response = await axios.post('http://localhost:3000/auth/cadastro', dadosCompletos)
        if(response.data.status === "sucesso"){
          toast.success("Cadastro realizado com sucesso!");
          navigate("/login")
        }
      }
      catch(error){
        console.log("Erro ao enviar dados:", error);
      }


  };


  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const novoCep = e.target.value;
    const novoCepLimpo = novoCep.replace(/\D/g, '');

    // Atualiza o estado visual (opcional se o Input for controlado pelo RHF, mas bom para garantir)
    // setCepDigitado(novoCep); <--- Se você estiver usando apenas useWatch, talvez nem precise dessa linha, mas o reset abaixo é essencial:

    // Lógica de Validação Síncrona
    if (novoCepLimpo.length < 8) {
        setCepPreenchido(false);
        // Opcional: limpar campos de endereço
        setValue("logradouro", "");
        setValue("bairro", "");
        setCidade(null);
        setUfSelecionada(null);
    }
};

  return (
        <form onSubmit={handleSubmit(onSubmit)} className="Formulario" >
            
            <h2 style={{ color: '#3D3468', marginBottom: '20px' }}>Criar Conta</h2>

            <Input 
              label="Nome Completo"
              placeholder="Ex: João da Silva"
              error={errors.nome}
              obrigatory={true}
              {...register("nome")} 
            />

            <Input 
              label="Nome de Exibição"
              placeholder="Ex: @joaosilva"
              error={errors.nome}
              mask="@aaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
              obrigatory={true}
              {...register("nome_exibicao")} 
            />

            <Input 
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              error={errors.email}
              obrigatory={true}
              {...register("email")}
            />

            <Input 
              label="Celular / WhatsApp"
              mask="(99) 99999-9999"
              placeholder="(00) 00000-0000"
              error={errors.telefone}
              obrigatory={true}
              {...register("telefone")}
            />

            <Input 
              label="CPF"
              mask="999.999.999-99"
              placeholder="000.000.000-00"
              error={errors.cpf}
              obrigatory={true}
              {...register("cpf")}
            />

            <div className="senhaInput" style={{display:'flex', width:'100%', position:'relative', alignItems:'center'}}>
              <Input 
                label="Senha"
                type={passwordVisible ? 'text' : 'password'}
                placeholder="Mín. 6 chars, letras e números"
                error={errors.senha}
                obrigatory={true}
                {...register("senha")}
              />
              {passwordVisible ? (
                 <FaEye className="olho" onClick={()=>setPasswordVisible(false)}/>
              ) : (
                 <FaEyeSlash className="olho" onClick={()=>setPasswordVisible(true)}/>
              )}
            </div>

            <Input
                label="CEP (Opcional)"
                mask="99999-999"
                placeholder="00000-000"
                error={errors.cep}
                {...register("cep")}
                {...(() => {
        const { onChange: onRHFChange, ...rest } = register("cep");
        return {
            ...rest,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                // Chama o React Hook Form (para ele saber que mudou)
                onRHFChange(e); 
                // Chama a SUA função (para resetar o estado se apagar)
                handleCepChange(e); 
            }
        };
    })()}
                
            />

            <div className="juncaoInputs" style={{display: 'flex', gap: '20px', width: '100%'}}>
                
                {/* 1. ESTADO */}
                <div style={{flex: 1}}>
                    <SelectInput
                        label="Estado (Opcional)"
                        placeholder="Selecione..."
                        options={ufOpcoes}
                        value={ufSelecionada}
                        
                        // CORREÇÃO: Aceita Single ou Multi na entrada, mas força Single no uso
                        onChange={(newValue: SingleValue<OptionType> | MultiValue<OptionType>) => {
                            const option = newValue as SingleValue<OptionType>; // <--- O PULO DO GATO
                            setUfSelecionada(option);
                            
                            // Limpeza
                            setCidade(null);
                            setCidadeOpcoes([]);
                        }}

                        isDisabled={cepPreenchido}

                        style={{
                          opacity: cepPreenchido ? 0.7 : 1,
                          cursor: cepPreenchido ? 'not-allowed' : 'text', // Força o cursor correto
                      }}
                        
                    />
                </div>

                {/* 2. CIDADE */}
                <div style={{flex: 1}}>
                    <SelectInput
                        label="Cidade (Opcional)"
                        placeholder="Busque..."
                        options={cidadeOpcoes}
                        value={cidade}
                        isDisabled={!ufSelecionada || cepPreenchido} 
                        
                        // CORREÇÃO: Mesma coisa aqui
                        onChange={(newValue: SingleValue<OptionType> | MultiValue<OptionType>) => {
                            const option = newValue as SingleValue<OptionType>;
                            setCidade(option);
                        }}

                        style={{
                          opacity: !cepPreenchido && ufSelecionada ?  1 : 0.7,
                          cursor: !cepPreenchido && ufSelecionada ? 'default' : 'not-allowed', // Força o cursor correto
                      }}

                        
                    />
                </div>
            </div>

            <span style={{width: '100%'}}>
              <Input
                  label="Bairro (Opcional)"
                  placeholder="Ex: Centro"
                  error={errors.bairro}
                  {...register("bairro")}
                  disabled={cepPreenchido}
                  style={{
                      opacity: cepPreenchido ? 0.7 : 1,
                      cursor: cepPreenchido ? 'not-allowed' : 'text', // Força o cursor correto
                  }}
              />
            </span>

            <span style={{width: '100%'}}>
              <Input
                  label="Endereço (Opcional)"
                  placeholder="Ruas, avenidas, etc."
                  error={errors.logradouro}
                  {...register("logradouro")}
                  disabled={cepPreenchido}
                  style={{
                      opacity: cepPreenchido ? 0.7 : 1,
                      cursor: cepPreenchido ? 'not-allowed' : 'text', // Força o cursor correto
                  }}
              />
            </span>

            <button type="submit" className="btnPadrao">
               <p>Cadastrar</p>
            </button>

            <Link style={{marginTop: 20}} to="/login"><p className="pLink" >Já tem conta? Login</p></Link>

        </form>
  );
}

export default Cadastro;