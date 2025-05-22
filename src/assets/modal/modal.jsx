import React, { useState } from 'react';
import { IoSunnyOutline } from "react-icons/io5";

export default function Modal({ isOpen, setOpenModal }) {
  const [pergunta, setPergunta] = useState('');
  const [resposta, setResposta] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  if (!isOpen) return null;

const styles = {
  container: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    width: '400px',
    maxHeight: '80vh',
    backgroundColor: 'rgba(30, 30, 47, 0.95)',
    borderRadius: '20px',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
    border: '1px solid #444',
    color: '#fff',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Arial, sans-serif',
  },
  closeButton: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '20px',
    cursor: 'pointer',
  },
  header: {
    padding: '20px 24px 10px',
    borderBottom: '1px solid #555',
    textAlign: 'center',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: 0,
  },
  sunIcon: {
    marginTop: '12px',
    fontSize: '20px',
    color: '#aaa',
  },
  subtitle: {
    color: '#bbb',
    marginTop: '6px',
    fontSize: '14px',
  },
  exampleButton: {
    backgroundColor: '#2a2a40',
    padding: '12px 14px',
    borderRadius: '12px',
    textAlign: 'left',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    width: '100%',
    marginBottom: '10px',
  },
  content: {
    padding: '16px 24px',
    overflowY: 'auto',
    flex: 1,
  },
  resposta: {
    marginTop: '16px',
    backgroundColor: '#1e1e2f',
    padding: '12px',
    borderRadius: '10px',
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#fff',
  },
  erro: {
    marginTop: '16px',
    backgroundColor: '#ff4d4d',
    padding: '12px',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#fff',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '16px 20px',
    borderTop: '1px solid #555',
    backgroundColor: '#1e1e2f',
  },
  input: {
    flex: 1,
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid #666',
    backgroundColor: '#2a2a40',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
  },
  buttonIcon: {
    fontSize: '20px',
    color: '#4aa3ff',
    cursor: 'pointer',
    userSelect: 'none',
  },
  loadingText: {
    padding: '12px',
    color: '#ccc',
    fontSize: '13px',
    textAlign: 'center',
  },
  };

  const handleEnviar = async () => {
    if (!pergunta.trim()) return;
    setErro('');
    setResposta('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/pergunta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pergunta }),
      });

      const data = await response.json();
      if (response.ok) {
        setResposta(data.resposta);
      } else {
        setErro(data.erro || 'Erro ao buscar resposta');
      }
    } catch {
      setErro('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
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
        <button style={styles.exampleButton} onClick={() => setPergunta("Quais as melhores palavras-chave para mim?")}>
          Como base no mercado atual, qual as melhores palavras-chave para mim?
        </button>
        <button style={styles.exampleButton} onClick={() => setPergunta("Como posso otimizar meus anúncios para atrair mais clientes?")}>
          Como posso otimizar meus anúncios para atrair mais clientes?
        </button>
        <button style={styles.exampleButton} onClick={() => setPergunta("Como posso melhorar o ranqueamento da minha loja nos mecanismos de busca?")}>
          Como posso melhorar o ranqueamento da minha loja nos mecanismos de busca?
        </button>

        {resposta && <div style={styles.resposta} dangerouslySetInnerHTML={{ __html: resposta }} />}
        {erro && <div style={styles.erro}>{erro}</div>}
        {loading && <p style={styles.loadingText}>Carregando resposta...</p>}
      </div>

      <div style={styles.footer}>
        <span style={styles.buttonIcon}>＋</span>
        <input
          type="text"
          placeholder="Digite sua dúvida..."
          style={styles.input}
          value={pergunta}
          onChange={(e) => setPergunta(e.target.value)}
          aria-label="Campo de digitação"
          onKeyDown={(e) => { if(e.key === 'Enter') handleEnviar() }}
        />
        <span style={styles.buttonIcon} onClick={handleEnviar} role="button" tabIndex={0} onKeyDown={(e) => { if(e.key === 'Enter') handleEnviar() }}>📨</span>
      </div>
    </div>
  );
}
