import Select, { type Props as SelectProps } from "react-select"; // 1. Correção do import
import { FaAsterisk } from "react-icons/fa6";
import type { CSSProperties } from "react";

// 2. Correção do ANY: Usamos <T> (Genérico) para dizer que aceita qualquer tipo de opção
interface SelectInputProps<T> extends SelectProps<T> {
  label: string;
  error?: { message?: string };
  obrigatory?: boolean;
  style?: CSSProperties;
}

// 3. Removemos 'className' da lista de variáveis para sumir o erro de "não usado"
export function SelectInput<T>({ label, error, obrigatory, style, ...props }: SelectInputProps<T>) {
  return (
    <div className="grupoInput">
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:'10px', width:'100%', paddingRight:'20px'}}>
              {label && <label className="grupoLabel">{label}</label>}
              {obrigatory ? (<FaAsterisk title="Obrigatório" style={{fontSize:"10px", color:"#B45C5C", cursor:'default'}} />) : null}
      </div>
      
    <div style={style ? { ...style, width: '100%' } : { width: '100%' }}>
      <Select
        // Estilos
        classNamePrefix="selectInput"
        // Adicionamos a lógica de erro aqui
        className={`select-container-full ${error ? "selectInput-error" : ""}`}
        
        // Passamos o resto das props (inclusive o onChange, value, options)
        {...props}
        
      />
    </div>

      {error && (
        <span style={{color: '#E74C3C', fontSize: '12px', marginTop: '5px'}}>
            {error.message}
        </span>
      )}
    </div>
  );
}