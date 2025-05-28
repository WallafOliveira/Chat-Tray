import React, { useRef, useState } from 'react';
import { IoSunnyOutline } from "react-icons/io5";
import './Chat.css';

export default function Modal({ isOpen, setOpenModal }) {
  const [pergunta, setPergunta] = useState('');
  const [resposta, setResposta] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [arquivo, setArquivo] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleEnviar = async () => {
    if (!pergunta.trim()) return;
    setErro('');
    setResposta('');
    setLoading(true);

    const formData = new FormData();
    formData.append("pergunta", pergunta);
    if (arquivo) formData.append("anexo", arquivo);

    try {
      const response = await fetch('http://127.0.0.1:5000/pergunta', {
        method: 'POST',
        body: formData,
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

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="modal-container">
      <button onClick={() => setOpenModal(false)} className="modal-close-button">✖</button>


      <div className="modal-header">
        <h2 className="modal-title">CHAT I.A - TRAY</h2>
        <IoSunnyOutline size={20} className="modal-sun-icon" />
        <p className="modal-subtitle">Exemplos de Uso:</p>
      </div>

      <div className="modal-content">
        <button className="modal-example-button" onClick={() => setPergunta("Quais as melhores palavras-chave para mim?")}>
          Como base no mercado atual, qual as melhores palavras-chave para mim?
        </button>
        <button className="modal-example-button" onClick={() => setPergunta("Como posso otimizar meus anúncios para atrair mais clientes?")}>
          Como posso otimizar meus anúncios para atrair mais clientes?
        </button>
        <button className="modal-example-button" onClick={() => setPergunta("Como posso melhorar o ranqueamento da minha loja nos mecanismos de busca?")}>
          Como posso melhorar o ranqueamento da minha loja nos mecanismos de busca?
        </button>

        {arquivo && (
          <div className="modal-file-info">
            📎 {arquivo.name}
          </div>
        )}

        {resposta && <div className="modal-resposta" dangerouslySetInnerHTML={{ __html: resposta }} />}
        {erro && <div className="modal-erro">{erro}</div>}
        {loading && <p className="modal-loading-text">Carregando resposta...</p>}
      </div>

      <div className="modal-footer">
        <span className="modal-button-icon" onClick={handleFileClick}>＋</span>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={(e) => setArquivo(e.target.files[0])}
        />
        <input
          type="text"
          placeholder="Digite sua dúvida..."
          className="modal-input"
          value={pergunta}
          onChange={(e) => setPergunta(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleEnviar(); }}
        />
        <span
          className="modal-button-icon"
          onClick={handleEnviar}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') handleEnviar(); }}
        >
          📨
        </span>
      </div>
    </div>
  );
}
