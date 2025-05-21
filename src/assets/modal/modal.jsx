import React from 'react';
import { IoSunnyOutline } from "react-icons/io5";

export default function Modal({ isOpen, setOpenModal }) {
  if (!isOpen) return null;

    const styles = {
      container: {
      position: 'fixed',   // Mantém fixo na tela
      bottom: '40px',
      right: '16px',
      width: '320px',
      backgroundColor: 'rgba(30, 30, 47, 0.9)',
      borderRadius: '16px',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5)',
      border: '1px solid #444',
      color: '#fff',
      zIndex: 1000,
      overflow: 'hidden',
      fontFamily: 'Arial, sans-serif',
    },
    closeButton: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: 'transparent',
      border: 'none',
      color: '#fff',
      fontSize: '18px',
      cursor: 'pointer',
    },
    header: {
      padding: '16px',
      borderBottom: '1px solid #555',
      textAlign: 'center',
    },
    title: {
      fontSize: '18px',
      fontWeight: 'bold',
      margin: 0,
    },
    sunIcon: {
      marginTop: '30px',
      fontSize: '18px',
      color: '#aaa',
    },
    subtitle: {
      color: '#aaa',
      marginTop: '1px',
    },
    exampleButton: {
      backgroundColor: '#2a2a40',
      padding: '10px 12px',
      borderRadius: '10px',
      textAlign: 'left',
      border: 'none',
      color: '#fff',
      cursor: 'pointer',
      fontSize: '13px',
      width: '100%',
      marginBottom: '8px',
    },
    content: {
      padding: '16px',
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 16px',
      borderTop: '1px solid #555',
      backgroundColor: '#1e1e2f',
    },
    input: {
      flex: 1,
      padding: '8px 10px',
      borderRadius: '8px',
      border: '1px solid #666',
      backgroundColor: '#2a2a40',
      color: '#fff',
      fontSize: '13px',
      outline: 'none',
    },
    buttonIcon: {
      fontSize: '18px',
      color: '#4aa3ff',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <button
        onClick={() => setOpenModal(false)}
        style={styles.closeButton}
        aria-label="Fechar chat"
      >
        ✖
      </button>

      <div style={styles.header}>
        <h2 style={styles.title}>CHAT I.A - TRAY</h2>
        <IoSunnyOutline size={20} style={styles.sunIcon} />
        <p style={styles.subtitle}>Exemplos de Uso:</p>
      </div>

      <div style={styles.content}>
        <button style={styles.exampleButton}>
          Como base no mercado atual, qual as melhores palavras-chave para mim?
        </button>
        <button style={styles.exampleButton}>
          Como posso otimizar meus anúncios para atrair mais clientes?
        </button>
        <button style={styles.exampleButton}>
          Como posso melhorar o ranqueamento da minha loja nos mecanismos de busca?
        </button>
      </div>

      <div style={styles.footer}>
        <span style={styles.buttonIcon}>＋</span>
        <input
          type="text"
          placeholder="Digite sua dúvida..."
          style={styles.input}
          aria-label="Campo de digitação"
        />
        <span style={styles.buttonIcon}>📨</span>
      </div>
    </div>
  );
}
