import { Input } from "../../components/Input/Input";
import { SelectInput } from "../../components/Input/SelectInput";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import './DatePicker.css';
import { itens } from "../../data/subItens"
import { toast } from "sonner";
import axios from "axios";

import { format } from 'date-fns';

import { type SingleValue, type MultiValue } from "react-select";

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Importa o CSS padrão (obrigatório)

// Configuração do Português
import { ptBR } from 'date-fns/locale/pt-BR';
registerLocale('pt-BR', ptBR);

// Importe o Controller do hook form
import { Controller } from "react-hook-form";
import { useMemo, useState } from "react";

import DropzoneInput from '../../components/DropzoneInput/DropzoneInput'


interface OptionType {
  label: string;
  value: string;
}

const schemaCadastro = z.object({
  nome_produto: z.string().min(6, "O nome precisa ter pelo menos 6 letras"),
  nome_edicao: z.string().min(3, "A edição precisa ter pelo menos 3 letras"),
  data_lancamento: z.date({
      required_error: "Data de nascimento é obrigatória",
      invalid_type_error: "Data inválida",
  }).nullable(),
  estado_produto: z.string(),
  categoria_produto: z.string(),
  franquia_produto: z.string(),
  descricao_produto: z.string().min(20, "A descrição precisa ter pelo menos 10 letras"),
  files: z.array(z.instanceof(File)).max(4, "Você pode enviar no máximo 4 fotos"),
});

type FormSchema = z.infer<typeof schemaCadastro>;





function CadastroProduto() {

    

    const [estado, setEstado] = useState<OptionType | null>(null);
    const [categoria, setCategoria] = useState<OptionType | null>(null);
    const [franquia, setFranquia] = useState<OptionType | null>(null);

    const estadoOpcoes: OptionType[] = [
        { label: "Impecável", value: "impecavel" },
        { label: "Bom", value: "bom" },
        { label: "Usado", value: "usado" },
        { label: "Danificado", value: "danificado" },
    ];

    const categoriaOpcoes: OptionType[] = itens.map((item) => ({
        label: item.title, value: item.title,
    }));




   


    const { 
        register, 
        formState: { errors },
        control,
        handleSubmit,
        setValue,
      } = useForm<FormSchema>({
        resolver: zodResolver(schemaCadastro),
        defaultValues: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            nome_produto: "", nome_edicao: "", data_lancamento: null as any, estado_produto: "", categoria_produto: "", franquia_produto: "", descricao_produto: "",
        }
      });

    
    const franquiaOpcoes = useMemo(()=>{

        if(!categoria) return;

        const categoriaEncontrada = itens.find(item => item.title === categoria.label);

        if(categoriaEncontrada){
            return categoriaEncontrada.subItens.map(( item ) => ({ label: item.title, value: item.title }))
        }

        return [];
        }, [categoria])



    const onSubmit = async (data: FormSchema) => {
    const dataFormatada = data.data_lancamento ? format(data.data_lancamento, 'yyyy-MM-dd') : '';
    
    // 1. Crie o objeto FormData
    const formData = new FormData();

    // 2. Adicione os campos de texto manualmente
    formData.append('nome_produto', data.nome_produto);
    formData.append('nome_edicao', data.nome_edicao);
    formData.append('descricao_produto', data.descricao_produto);
    formData.append('estado_produto', estado?.value || '');
    formData.append('categoria_produto', categoria?.value || '');
    formData.append('franquia_produto', franquia?.value || '');
    formData.append('data_lancamento', dataFormatada);

    // 3. Adicione os arquivos (o nome 'files' deve bater com o esperado no Multer do backend)
    if (data.files && data.files.length > 0) {
        data.files.forEach((file) => {
            formData.append('fotos', file); 
        });
    }

    try{
      const response = await axios.post('http://localhost:3000/produtos/', formData, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      })
      const result = response.data
      console.log(result)
      if (result.status == "sucesso"){
        toast.success("Item Cadastrado com Sucesso!");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(error: any){
      if (error.response) {
        console.log("Status:", error.response.status); 
        console.log("Mensagem do Backend:", error.response.data);
    } else {
        console.log("Erro de conexão:", error.message);
        toast.error("Sem conexão com o servidor.");
    }
    }

    console.log("Dados enviados:", formData);
  };
      

  const lidarComArquivos = (arquivosRecebidos: File[]) => {
      console.log("O filho me mandou estes arquivos:", arquivosRecebidos);
      setValue('files', arquivosRecebidos); // Salva no formulário
  };
    


    return(
        <form onSubmit={handleSubmit(onSubmit)} className="Formulario">
            <h2 style={{ color: '#3D3468', marginBottom: '20px' }}>Cadastrar Produto</h2>

            <div className="juncaoInputs">
                <Input
                label="Nome do Produto"
                error={errors.nome_produto}
                placeholder="Digite o nome do produto"
                {...register("nome_produto", {required: "Não deixe este campo vazio"})}
                />

                <Input
                label="Nome da Edição"
                error={errors.nome_edicao}
                placeholder="Digite o nome da edição"
                {...register("nome_edicao", {required: "Não deixe este campo vazio"})}
                />
            </div>


            <div className="juncaoInputs">
                <div style={{ position: 'relative', width: '100%', display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                    <label className="labelDP" htmlFor="data_lancamento">Data de Lançamento</label>
                    <Controller
                    control={control}
                    name="data_lancamento"
                    render={({ field }) => (
                        <DatePicker 
                        placeholderText="Selecione a data"
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onChange={(date: any) => field.onChange(date)} // Manda a data pro Hook Form
                        selected={field.value} // Pega o valor atual do Hook Form
                        dateFormat="dd/MM/yyyy" // Formato visual
                        locale="pt-BR" // Tradução
                        showYearDropdown // Mostra lista de anos
                        showMonthDropdown
                        scrollableYearDropdown // Permite rolar os anos
                        yearDropdownItemNumber={100} // Mostra 100 anos atrás
                        maxDate={new Date()} // Não permite datas futuras
                        className="input-estilizado" // Sua classe de CSS de inputs
                        dropdownMode="select"
                        
                        />
                    )}
                    >
                    </Controller>
                </div>

                <div style={{flex: 1, width: '100%'}}>
                    <SelectInput
                        label="Estado de Conservação"
                        placeholder="Selecione..."
                        options={estadoOpcoes}
                        value={estado}
                        onChange={(newValue: SingleValue<OptionType> | MultiValue<OptionType>) => {
                            const option = newValue as SingleValue<OptionType>; // <--- O PULO DO GATO
                            setEstado(option);
                        }}
                    />
                </div>
            </div>
            
            <div className="juncaoInputs">
                <div style={{flex: 1, width: '100%'}}>
                    <SelectInput
                        label="Categoria do Produto"
                        placeholder="Selecione..."
                        options={categoriaOpcoes}
                        value={categoria}
                        onChange={(newValue: SingleValue<OptionType> | MultiValue<OptionType>) => {
                            const option = newValue as SingleValue<OptionType>; // <--- O PULO DO GATO
                            setCategoria(option);

                            setFranquia(null)
                        }}
                    />
                </div>
                
                <div onClick={()=>{if(!categoria) toast.warning("Selecione uma Categoria primeiro!")}} style={{flex: 1, width: '100%'}}>
                    <SelectInput
                        label="Franquia do Produto"
                        placeholder="Selecione..."
                        options={franquiaOpcoes}
                        value={franquia}
                        isDisabled={!categoria}
                        onChange={(newValue: SingleValue<OptionType> | MultiValue<OptionType>) => {
                            const option = newValue as SingleValue<OptionType>; // <--- O PULO DO GATO
                            setFranquia(option);
                        }}
                        
                    />
                </div>
            </div>
            
            <Input
            label="Descrição do Produto"
            error={errors.descricao_produto}
            isTextArea={true}
            placeholder="Digite a descrição do produto"
            {...register("descricao_produto", {required: "Não deixe este campo vazio"})}
            />

            <DropzoneInput onFileChange={lidarComArquivos} initialPreviews={[]} />


            <button type="submit" className="btnPadrao">
            <p>Cadastrar Produto</p>
          </button>
        </form>
    )
}


export default CadastroProduto;