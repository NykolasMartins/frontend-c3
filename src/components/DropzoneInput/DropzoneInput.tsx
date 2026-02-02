
import { useDropzone } from 'react-dropzone';
import './DropzoneInput.css';
import { FaCloudUploadAlt } from 'react-icons/fa'
import { useState, useCallback } from 'react';
import { FaTrash } from 'react-icons/fa6';

interface UploadProps {
  onFileChange: (arquivo: File[]) => void;
  initialPreviews?: string[];
}

function DropzoneInput({onFileChange, initialPreviews = []}: UploadProps) {

    const [previews, setPreviews] = useState<string[]>(initialPreviews);
    const [files, setFiles] = useState<File[]>([]);

     const onDrop = useCallback((acceptedFiles: File[]) => {
        // Cria as URLs para mostrar na tela
        const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));

        // Atualiza o estado visual (o que já tinha + os novos)
        setPreviews(prev => [...prev, ...newPreviews]);
        
        // Atualiza o estado dos arquivos reais
        setFiles(prev => {
            const newFiles = [...prev, ...acceptedFiles];
            onFileChange(newFiles); // Avisa o pai (Formulário)
            return newFiles;
        });

    }, [onFileChange]);



    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
            onDrop,
            maxFiles: 4,
            accept: {
                'image/*': []
            }
        })

        const removeImage = (index: number) => {
        const newPreviews = previews.filter((_, i) => i !== index);
        const newFiles = files.filter((_, i) => i !== index);
        
        setPreviews(newPreviews);
        setFiles(newFiles);
        onFileChange(newFiles);
    };
   

    // Lógica para definir qual classe CSS usar
    const baseClass = "dropzone-container";
    const activeClass = isDragActive ? "dropzone-active" : "";
    const rejectClass = isDragReject ? "dropzone-reject" : "";
    
    // Junta tudo numa string final
    const classNameFinal = `${baseClass} ${activeClass} ${rejectClass}`;

    



    return(
        <div style={{width:'100%', display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <label className='grupoLabel'>Imagens do produto</label>
            
            <div className={classNameFinal} {...getRootProps()}>
                <FaCloudUploadAlt className='dropzone-icon'/>
                <input {...getInputProps()} />
                {
                    isDragActive ? <p>Solte a imagem aqui</p> : <p>Arraste e largue imagens aqui, ou clique para selecionar</p>
                }

                
            </div>

            {previews.length > 0 && (
                    <div className="preview-grid">
                        {previews.map((url, index) => (
                            <div key={index} className="preview-image">
                                <img src={url} alt={`Preview ${index}`} />
                                <button 
                                    type="button" 
                                    onClick={() => removeImage(index)}
                                    className="btn-remove"
                                >
                                    <FaTrash size={16} color='#615110BF' />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
        </div>
    );
}


export default DropzoneInput;