import React, { useState, useRef, useEffect } from 'react';
import './OtpInput.css';

interface OtpInputProps {
  length?: number;
  onComplete: (code: string) => void;
}

export function OtpInput({ length = 8, onComplete }: OtpInputProps) {
  // Cria um array de strings vazias baseado no tamanho (ex: 6 posições)
  const [code, setCode] = useState<string[]>(new Array(length).fill(''));
  
  // Cria refs para cada input para podermos focar neles manualmente
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Monitora quando o código está completo para avisar o pai
  useEffect(() => {
    if (code.every(digit => digit !== '')) {
      onComplete(code.join(''));
    }
  }, [code, onComplete]);

  // Lógica de Digitação
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    
    // Aceita apenas números (se quiser letras, remova o regex)
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    // Pega apenas o último caractere digitado (caso o usuário tente digitar 2 números num box só)
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    // Se digitou algo, pula para o próximo input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Lógica de Backspace (Apagar)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      // Se o input atual estiver vazio e não for o primeiro, volta o foco para o anterior
      if (!code[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      
      // Limpa o valor atual
      const newCode = [...code];
      newCode[index] = '';
      setCode(newCode);
      
      // Se tinha valor, apaga. Se não tinha, o código acima já focou no anterior.
      if (index > 0 && !code[index]) {
         inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // Lógica de Colar (Ctrl+V) - A "cereja do bolo" da UX
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    
    if (!/^\d+$/.test(pastedData)) return; // Só aceita se for números

    const newCode = [...code];
    pastedData.split('').forEach((char, i) => {
      newCode[i] = char;
    });
    setCode(newCode);

    // Foca no último input preenchido ou no próximo vazio
    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="otp-container">
      {code.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          ref={(el) => {inputRefs.current[index] = el}}
          className="otp-field"
        />
      ))}
    </div>
  );
}