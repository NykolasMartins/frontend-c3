import { FaLocationArrow, FaMagnifyingGlass, FaPaperclip } from "react-icons/fa6";
import { Input } from "../../components/Input/Input";
import "./Chat.css";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";



// 1. Definimos a estrutura da nossa mensagem
interface IMessageData {
  room: number | null;
  author: string;
  message: string;
  time: string;
}

interface Conversa {
  id_conversa: number;
  nome_destinatario: string;
  ultima_mensagem: string;
  data_ultima_mensagem: string;
}

// 2. Tipamos a instância do socket
// Se você quiser ser bem rigoroso, pode passar os eventos para o genérico: Socket<ServerToClientEvents, ClientToServerEvents>
const socket: Socket = io("http://localhost:3000");

function Chat() {
    
  const [message, setMessage] = useState<string>("");
  const [chatLog, setChatLog] = useState<IMessageData[]>([]);
  const [user, setUser] = useState<string | null>(null);
  const [room, setRoom] = useState<number | null>(null)
  const [conversaSelecionada, setConversaSelecionada] = useState<Conversa | null>(null);
  const [conversas, setConversas] = useState<Conversa[]>([]); // Você pode criar uma interface para isso depois

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // ==========================================
  // EFEITO 1: Carrega Usuário e Lista (Apenas 1x)
  // ==========================================
  useEffect(() => {
    const carregarSetupInicial = async () => {
      if (!token) {
        navigate("/login");
        toast.error("Faça login para acessar o chat!");
        return;
      }
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

        // 1. Busca o usuário
        const resUser = await axios.get(`${API_URL}/auth/principal`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(resUser.data.nome_exibicao);

        // 2. Busca a lista de conversas
        const resConversas = await axios.get(`${API_URL}/mensagens/listar_conversas`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setConversas(resConversas.data);

        // 3. Seleciona a primeira conversa se houver
        if (resConversas.data.length > 0) {
          setConversaSelecionada(resConversas.data[0]);
        }

      } catch (error) {
        console.error("Erro no setup inicial:", error);
      }
    };

    carregarSetupInicial();
  }, []); // Array vazio

  // ==========================================
  // EFEITO 2: Carrega Histórico do Chat Selecionado
  // ==========================================
  useEffect(() => {
    const carregarHistorico = async () => {
      if (!conversaSelecionada || !user) return; 

      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const resChat = await axios.get(`${API_URL}/mensagens/${conversaSelecionada.nome_destinatario}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const { id_conversa, historico } = resChat.data;
        setRoom(id_conversa);

        // FORMATANDO O HISTÓRICO:
        // ATENÇÃO: O seu backend precisa estar enviando o nome (ex: nm_usuario_autor)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const historicoFormatado = historico.map((msg: any) => ({
          room: msg.id_conversa,
          author: msg.nm_usuario_autor === user ? user : conversaSelecionada?.nome_destinatario,
          message: msg.ds_mensagem,
          time: msg.hr_envio
        }));

        setChatLog(historicoFormatado);
        
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      }
    };

    carregarHistorico();
  }, [conversaSelecionada, user]); // Só reage ao mudar de chat ou ao carregar o user

  // ==========================================
  // EFEITO 3: Socket.io
  // ==========================================
  useEffect(() => {
    if (room) {
      socket.emit("join_room", { room });

      socket.on("receive_message", (data: IMessageData) => {
        setChatLog((prev) => [...prev, data]);
      });

      return () => {
        socket.off("receive_message");
      };
    }
  }, [room]);

  // ==========================================
  // ENVIO DE MENSAGEM
  // ==========================================
  const sendMessage = async (): Promise<void> => {
    if (message.trim() !== "" && user) {
      const messageData: IMessageData = {
        room: room,
        author: user, // Manda o nome para a tela (o backend se vira com o token)
        message: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      socket.emit("send_message", messageData); 
      setChatLog((prev) => [...prev, messageData]); // Aparece na hora para você
      setMessage("");
    }
  };


  return (
    <div className="Chat" style={{marginTop: "20px"}}>
      <div className="Formulario chat-list">
        <div className="input-search">
          <Input error={undefined} placeholder="Pesquise suas conversas" />
          <FaMagnifyingGlass fontSize="22px" className="search-icon" />
        </div>
        <div className="filter-row">
            <div className="filter-item">Geral</div>
            <div className="filter-item">Não lidas</div>
            <div className="filter-item">Favoritas</div>
        </div>
        <div className="chat-list">
          {conversas.map((conversa) => (
            <div className="chat-item" key={conversa.id_conversa} onClick={() => setConversaSelecionada(conversa)}>
              <div className="chat-avatar">
                <FaUserCircle size={36} color='#530e7e' />
              </div>
              <div className="chat-info">
                <p className="chat-name">{conversa.nome_destinatario}</p>
                <p className="chat-last-message">{conversa.ultima_mensagem}</p>
              </div>
              <div className="chat-time">{conversa.data_ultima_mensagem}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="Formulario current-chat">
        <div className="message-list">
            {chatLog.map((msg, index) => (
                /* Lógica: se o autor for você, classe 'sent', senão 'received' */
                <div key={index} className={`message ${msg.author === user ? "sent" : "received"}`}>
                    <div className="message-content">{msg.message}</div>
                    <div className="message-info">
                        <div className="message-time">{msg.time}</div>
                        {msg.author === user && (
                        <div className="message-check-mark">
                            <IoCheckmarkDoneSharp size={16} color="#3D3468" />
                        </div>
                        )}
                    </div>
                </div>
            ))}
        </div>

        <div className="input-area">
            <div className="input-msg">
                <Input 
                placeholder="Digite sua mensagem"  
                value={message} // <-- Liga o input à variável
                onChange={(e) => setMessage(e.target.value)}
                />
                <div className="input-clip-arrow-icon">
                    <FaPaperclip size={24} color="#615110" />
                    <FaLocationArrow size={24} color="#615110"  onClick={sendMessage} />
                </div>
                
            </div>
            <button className="btnPadrao"><p>Concluir Troca</p></button>
        </div>

        {
          conversaSelecionada && (
            <div className="user-info-card">
            <div className="chat-avatar">
                <FaUserCircle size={36} color='#530e7e' />
            </div>
            <div className="chat-info">
                <p className="chat-name">{conversaSelecionada?.nome_destinatario}</p>
                <p className="activity-status">Online em {conversaSelecionada?.data_ultima_mensagem}</p>
            </div>
        </div>
          )}
      </div>

    </div>
  );
}

export default Chat;
