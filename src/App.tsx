import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Login from './pages/Login/Login';
import Cadastro from './pages/Cadastro/Cadastro';
import { Toaster } from 'sonner';
import EsqueceuSenha from './pages/EsqueceuSenha/EsqueceuSenha';
import CadastroProduto from './pages/CadastroProduto/CadastroProduto';
import EnviarCodigo from './pages/EnviarCodigo/EnviarCodigo';
import NovaSenha from './pages/NovaSenha/NovaSenha';

import Home from './pages/Home/Home';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CriarPostagem from './pages/CriarPostagem/CriarPostagem';
import DetalhesProduto from './pages/DetalhesProduto/DetalhesProduto';
import MeusDesejos from './pages/MeusDesejos/MeusDesejos';
import EnviarProposta from './pages/EnviarProposta/EnviarProposta';
import Chat from './pages/Chat/Chat';

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [user, setUser] = useState<string | null>(null)

  useEffect(()=>{
    const token = localStorage.getItem('token'); // ou o nome que você usou

    const loadUser = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.get(`${API_URL}/auth/principal`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(response.data.nome_exibicao);
      console.log(response.data)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (error.response?.status === 401) {
             console.warn("O Token atual é inválido ou expirou. Limpando dados...");
             localStorage.removeItem('token');
             
         } else {
             console.error("Erro de conexão (Server down?)", error);
         }
      } finally {
        setIsLoading(false);
      }
  };


  

    if (token) {
      loadUser(); // Só chama a API se tiver token
    } else {
      setIsLoading(false); 
      console.log("Visitante acessando (sem token detectado).");
    }

  }, [])




  return (
    <div className="App">
      {isLoading ? (

        <div >
          
        </div>

      )
    
    :

    (
      <div>
        <Header isLogged={!!user} userName={user} />

      <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/esqueceu-senha" element={<EsqueceuSenha />} />
          <Route path="/cadastro-produto" element={<CadastroProduto />} />
          <Route path='/esqueceu-senha/enviar-codigo' element={<EnviarCodigo />} />
          <Route path='/esqueceu-senha/nova-senha' element={<NovaSenha />} />
          <Route path='/testeProduto' element={<DetalhesProduto />} />
          <Route path='/detalhes-produto/:product_id' element={<DetalhesProduto />} />
          <Route path='/criar-postagem' element={<CriarPostagem />} />
          <Route path='/meus-desejos' element={<MeusDesejos />} />
          <Route path='/enviar-proposta' element={<EnviarProposta />} />
          <Route path='/chat' element={<Chat />} />
        </Routes>
      </main>


      <Toaster 
        position="bottom-right"
        toastOptions={{
          // Aqui define apenas o "Comum a todos"
          style: {
            background: '#3D3468', // Roxo C3
            color: '#FFFFFF',      // Texto Branco
            fontFamily: '"Montserrat", sans-serif',
            fontSize: '14px',
            // A borda padrão (será substituída pelo CSS)
            border: '2px solid #8b9aa7', 
          },
        }}
        />
      </div>
    )
    }
      
    </div>
  )
}

export default App
