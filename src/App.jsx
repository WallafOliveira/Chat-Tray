import { useState } from 'react';
import './App.css';
import Modal from './templates/chat';
import { FaRobot } from 'react-icons/fa';
import Gestao from './templates/gestao.jsx';

function App() {
  const [openModal, setOpenModal] = useState(false);

  const styles = {
    robotIcon: {
      position: 'fixed',
      bottom: '45px',
      right: '45px',
      borderRadius: '16px',
      cursor: 'pointer',
      padding: '10px',
      backgroundColor: 'black',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      zIndex: 1000, 
    }
  };

  return (
    <div className="App">
      <h1>Chat IA - TRAY</h1>

      {/* Seu painel administrativo */}
      <Gestao/>

      {/* Botão do robô para abrir o chat */}
      {!openModal && (
        <button
          onClick={() => setOpenModal(true)}
          style={styles.robotIcon}
          aria-label="Abrir chat"
        >
          <FaRobot size={25} />
        </button>
      )}

      {/* Modal do chat */}
      <Modal isOpen={openModal} setOpenModal={setOpenModal} />
    </div>
  );
}

export default App;
