import React, { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { IMaskInput } from "react-imask";
import "./Input.css";
import { FaAsterisk } from "react-icons/fa";

interface FieldError {
  message?: string;
}

// Unimos os tipos de Input e Textarea para o TypeScript não reclamar
type InputOrTextAreaProps = InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>;

interface InputProps extends InputOrTextAreaProps {
  label?: string;
  error?: FieldError;
  mask?: string;
  obrigatory?: boolean;
  isTextArea?: boolean; // <--- NOVA PROP
}

function InputComponent(
  props: InputProps,
  ref: React.ForwardedRef<HTMLInputElement | HTMLTextAreaElement> // <--- REF HÍBRIDA
) {
  const { label, error, mask, children, obrigatory, isTextArea, ...outrasProps } = props;

  // Ignora a variável children para o TypeScript não reclamar
  void children;

  const estiloInput = `Input ${error ? "error" : ""}`;

  return (
    <div className="grupoInput">
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:'10px', width:'100%', paddingRight:'20px'}}>
        {label && <label className="grupoLabel">{label}</label>}
        {obrigatory ? (<FaAsterisk title="Obrigatório" style={{fontSize:"10px", color:"#B45C5C", cursor:'default'}} />) : null}
      </div>

      {/* LÓGICA DE RENDERIZAÇÃO */}
      {mask ? (
        // CASO 1: TEM MÁSCARA (Sempre será Input)
        <IMaskInput
          mask={String(mask)}
          definitions={{
            "9": /[0-9]/,
          }}
          className={estiloInput}
          inputRef={ref as React.RefObject<HTMLInputElement>}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...(outrasProps as any)}
        />
      ) : isTextArea ? (
        // CASO 2: É TEXTAREA (Campo grande)
        <textarea
            ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
            className={estiloInput}
            rows={5} // <--- COMEÇA COM 5 LINHAS
            style={{ 
                resize: "vertical", // Permite o usuário aumentar a altura se quiser
                fontFamily: "inherit" // Garante que a fonte seja igual a do input
            }} 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...outrasProps as any} 
        />
      ) : (
        // CASO 3: INPUT NORMAL
        <input 
            ref={ref as React.ForwardedRef<HTMLInputElement>} 
            className={estiloInput} 
            {...outrasProps} 
        />
      )}

      {error && <span className="erroMsg" style={{marginTop:"-5px", marginLeft:"10px"}}>{error.message}</span>}
    </div>
  );
}

export const Input = forwardRef(InputComponent);