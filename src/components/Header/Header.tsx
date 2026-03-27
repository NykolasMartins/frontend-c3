import LogoC3 from '../../assets/logoC3_Header.png';
import './Header.css';
import { FaMagnifyingGlass, FaPlus } from "react-icons/fa6";
import { FaBars, FaUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { itens } from "../../data/subItens.ts"
import { useState } from 'react';
import ModalCriar from '../ModalCriar/ModalCriar.tsx';
import { PiSignOutBold } from "react-icons/pi";





interface subItem {
    id: number,
    title: string,
    link: string,
}

interface CategoriaItens{
    id: number,
    title: string,
    link: string,
    subItens: subItem[]
}

interface headerProps{
  isLogged: boolean,
  userName: string | null
}

function Header({isLogged, userName}: headerProps){

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [activeSubMenu, setActiveSubMenu] = useState<number | null>(null)
  const [subItemSelecionado, setSubItemSelecionado] = useState<CategoriaItens>()

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const onClose = ()=> {
    setIsOpen(false)
  }

    return(
        <header>
        <div className='mudarPesquisa'>
          <div className='topoHeader'>
              <div className='logoPesquisa'>
                <Link to="/"><img src={LogoC3} alt="Logo C3" width="44px" /></Link>
                <div className='pesquisa'>
                  <input type="text" />
                  <span className="divisor"></span>
                  <FaMagnifyingGlass color='#D9E4EE' fontSize="22px" className='lupa' />
                  
                </div>
              </div>
              {
                isLogged ? 

                <div style={{display: "flex", gap: '30px'}}>

                  <div className='criarBtn' onClick={()=>{setIsOpen(true)}}>
                    <p>Criar</p>
                    <FaPlus size={24} />
                  </div>

                  <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <p style={{fontSize:'16px'}}>@{userName}</p>
                    <FaUserCircle size={36} color='#D9E4EE' />

                    <div style={{cursor:"pointer"}}>
                    <PiSignOutBold size={28} color='#D9E4EE' onClick={()=>{localStorage.removeItem('token'); window.location.reload();}} />
                    </div>
                  </div>

                  

                </div>
                

                :
                
                <div className='loginCadastro'>
                  <Link to="/cadastro">
                  <p className='cadastroP'>Cadastrar</p>
                  </Link>
                  <Link to="/login">
                  <div className='entrarBtn'>
                    <p>Entrar</p>
                  </div>
                  </Link>
                </div>

                }

          </div>
          <div className='menuPesquisa'>
            <FaBars display="none" className='barras' onClick={() => isMenuOpen ? ( setIsMenuOpen(false) ) :  (setIsMenuOpen(true) )} />
            <div className='pesquisa' id='pesquisaAlt'>
                <input type="text" />
                <span className="divisor"></span>
                <FaMagnifyingGlass color='#D9E4EE' fontSize="22px" className='lupa'/>
            </div>
           </div>
        </div>

        <nav style={{position: 'relative', display: 'flex', flexDirection:'column', width: '100%'}}  onMouseLeave={() => setActiveSubMenu(null) }>
          
          <div className='navHeader full-width'  >
            {itens.map((item: CategoriaItens) => (
              <div key={item.id} className="nav-wrapper">
                
                <Link to={item.link}>
                  <li onMouseEnter={async() => {setSubItemSelecionado(item);  setActiveSubMenu(item.id);  }}>{item.title}</li>
                </Link>
              
                
              </div>
          
            ))}

          </div>
          {activeSubMenu && (
            <div className='navSubItem'>
                  {activeSubMenu && (
                    subItemSelecionado?.subItens?.map((sub: subItem)=>(
                      <Link key={sub.id} to={sub.link}>
                        <li>{sub.title}</li>
                      </Link>
                    )))}
          </div>
          )}
          

          {isMenuOpen && 
            <div className='navHeader media'>
              {itens.map((item: CategoriaItens) => (
                <Link key={item.id} to={item.link}>
                  <li>{item.title}</li>
                </Link>
              ))}
            </div>

            
            

          }

          
            
        </nav>
        
     <ModalCriar isOpen={isOpen} onClose={onClose}/> 
      </header>
    )
}

export default Header;