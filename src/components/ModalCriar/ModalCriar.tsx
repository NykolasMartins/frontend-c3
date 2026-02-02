import { FaXmark } from "react-icons/fa6";
import './ModalCriar.css'
import { GiOpenTreasureChest, GiNotebook, GiScrollQuill } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


interface modalSchema {
    isOpen: boolean
    onClose: () => void
}

function ModalCriar({ isOpen, onClose }: modalSchema){

    const navigate = useNavigate()

    const handleNavigate = (path: string) => {
        onClose(); // Fecha o modal
        navigate(path); // Vai para a página
    }

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // Trava rolagem
        } else {
            document.body.style.overflow = 'unset'; // Destrava
        }

        // Cleanup function (garantia de destravar se o componente morrer)
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);


    if(!isOpen) return null;

    return(
        <div className="modal-overlay" onClick={onClose}>
            <div className="ModalCriar" onClick={(e) => e.stopPropagation()}>

                <h2 style={{ color: '#3D3468', marginBottom: '20px',  textAlign: 'center' }}>O que você quer criar?</h2>

                <FaXmark size={24} color="#9F8536" style={{position: 'absolute', top: '20px', right: '20px', cursor: 'pointer',}} onClick={onClose} />
               
               <div className="modal-content">
                    <div className="modal-card" onClick={() => handleNavigate("/cadastro-produto")}>
                        <p>Produto</p>
                        <GiOpenTreasureChest size={70} color="#9F8536" className="modal-card-icon" />
                    </div>
                    <div className="modal-card" onClick={() => handleNavigate("/criar-postagem")}>
                        <p>Postagem</p>
                        <GiScrollQuill size={70} color="#9F8536" className="modal-card-icon"/>
                    </div>
                    <div className="modal-card" onClick={() => handleNavigate("/meus-desejos")}>
                        <p>Desejo</p>
                        <GiNotebook size={70} color="#9F8536" className="modal-card-icon" />
                    </div>
                </div>
            </div>
        </div>
    )
}


export default ModalCriar;