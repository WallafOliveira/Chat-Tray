import { useState } from 'react'
import './App.css'
import Modal from './templates/chat'
import { FaRobot } from 'react-icons/fa'

function App() {
  const [openModal, setOpenModal] = useState(false)

  const styles = {
    robotIcon: {
      position: 'fixed',
      bottom: '45px',
      right: '45px',
      borderRadius: '16px',
      cursor: 'pointer',
      padding: '10px',
      backgroundColor: '#f0f0f0',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    }
  }

  return (
    <>
      <div className="App">
        <h1>Chat IA - TRAY</h1>

        {!openModal && (
          <button
            onClick={() => setOpenModal(true)}
            style={styles.robotIcon}
            aria-label="Abrir chat"
          >
            <FaRobot size={25} />
          </button>
        )}

        <Modal isOpen={openModal} setOpenModal={setOpenModal} />
      </div>
    </>
  )
}

export default App
