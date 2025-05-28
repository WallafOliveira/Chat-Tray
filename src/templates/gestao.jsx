import { useState, useEffect } from 'react';
import './Gestao.css';

function Gestao() {
  const [showClienteForm, setShowClienteForm] = useState(false);
  const [showProdutoForm, setShowProdutoForm] = useState(false);

  const [cliente, setCliente] = useState({ nome: '', email: '', telefone: '', cidade: '', estado: '', cep: '' });
  const [produto, setProduto] = useState({ nome: '', preco: '', quantidade: '' });

  const [msgCliente, setMsgCliente] = useState('');
  const [msgProduto, setMsgProduto] = useState('');

  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);

  const handleClienteChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleProdutoChange = (e) => {
    setProduto({ ...produto, [e.target.name]: e.target.value });
  };

  const carregarClientes = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5001/api/clientes');
      if (res.ok) {
        const data = await res.json();
        setClientes(data);
      } else {
        setClientes([]);
      }
    } catch {
      setClientes([]);
    }
  };

  const carregarProdutos = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5001/api/produtos');
      if (res.ok) {
        const data = await res.json();
        setProdutos(data);
      } else {
        setProdutos([]);
      }
    } catch {
      setProdutos([]);
    }
  };

  const submitCliente = async (e) => {
    e.preventDefault();
    setMsgCliente('');
    try {
      const res = await fetch('http://127.0.0.1:5001/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente),
      });
      const data = await res.json();
      if (res.ok) {
        setMsgCliente(data.sucesso);
        setCliente({ nome: '', email: '', telefone: '', cidade: '', estado: '', cep: '' });
        await carregarClientes();
        setShowClienteForm(false);
      } else {
        setMsgCliente(data.erro || 'Erro ao cadastrar cliente');
      }
    } catch {
      setMsgCliente('Erro de conexão com o servidor');
    }
  };

  const submitProduto = async (e) => {
    e.preventDefault();
    setMsgProduto('');
    try {
      const res = await fetch('http://127.0.0.1:5001/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto),
      });
      const data = await res.json();
      if (res.ok) {
        setMsgProduto(data.sucesso);
        setProduto({ nome: '', preco: '', quantidade: '' });
        await carregarProdutos();
        setShowProdutoForm(false);
      } else {
        setMsgProduto(data.erro || 'Erro ao cadastrar produto');
      }
    } catch {
      setMsgProduto('Erro de conexão com o servidor');
    }
  };

  useEffect(() => {
    carregarClientes();
    carregarProdutos();
  }, []);

return (
    <div className="gestao-container">
      <div className="gestao-box">
        {!showClienteForm && (
          <button
            className={showProdutoForm ? "gestao-button gestao-button-disabled" : "gestao-button"}
            onClick={() => {
              setShowClienteForm(true);
              setShowProdutoForm(false);
              setMsgProduto('');
            }}
            disabled={showProdutoForm}
          >
            Cadastrar Cliente
          </button>
        )}

        {showClienteForm && (
          <form onSubmit={submitCliente}>
            <h3>Cadastro de Cliente</h3>
            <input
              className="gestao-input"
              type="text"
              name="nome"
              placeholder="Nome"
              value={cliente.nome}
              onChange={handleClienteChange}
              required
            />
            <input
              className="gestao-input"
              type="email"
              name="email"
              placeholder="Email"
              value={cliente.email}
              onChange={handleClienteChange}
              required
            />
            <input
              className="gestao-input"
              name="telefone"
              placeholder="Telefone"
              value={cliente.telefone}
              onChange={handleClienteChange}
              required
            />
            <input
              className="gestao-input"
              name="cidade"
              placeholder="Cidade"
              value={cliente.cidade}
              onChange={handleClienteChange}
              required
            />
            <input
              className="gestao-input"
              name="estado"
              placeholder="Estado"
              value={cliente.estado}
              onChange={handleClienteChange}
              required
            />
            <input
              className="gestao-input"
              name="cep"
              placeholder="CEP"
              value={cliente.cep}
              onChange={handleClienteChange}
              required
            />

            <button type="submit" className="gestao-button">
              Salvar Cliente
            </button>
            <button
              type="button"
              className="gestao-button gestao-button-cancelar"
              onClick={() => setShowClienteForm(false)}
            >
              Cancelar
            </button>

            {msgCliente && <p className="gestao-msg">{msgCliente}</p>}
          </form>
        )}

        {!showClienteForm && (
          <>
            <h4>Clientes cadastrados:</h4>
            <div className="gestao-lista">
              {clientes.length === 0 ? (
                <p>Nenhum cliente cadastrado.</p>
              ) : (
                <table className="gestao-tabela">
                  <thead>
                    <tr>
                      <th className="gestao-thtd">Nome</th>
                      <th className="gestao-thtd">Email</th>
                      <th className="gestao-thtd">Telefone</th>
                      <th className="gestao-thtd">Cidade</th>
                      <th className="gestao-thtd">Estado</th>
                      <th className="gestao-thtd">CEP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map((c) => (
                      <tr key={c.id}>
                        <td className="gestao-thtd">{c.nome}</td>
                        <td className="gestao-thtd">{c.email}</td>
                        <td className="gestao-thtd">{c.telefone}</td>
                        <td className="gestao-thtd">{c.cidade}</td>
                        <td className="gestao-thtd">{c.estado}</td>
                        <td className="gestao-thtd">{c.cep}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>

      <div className="gestao-box">
        {!showProdutoForm && (
          <button
            className={showClienteForm ? "gestao-button gestao-button-disabled" : "gestao-button"}
            onClick={() => {
              setShowProdutoForm(true);
              setShowClienteForm(false);
              setMsgCliente('');
            }}
            disabled={showClienteForm}
          >
            Cadastrar Produto
          </button>
        )}

        {showProdutoForm && (
          <form onSubmit={submitProduto}>
            <h3>Cadastro de Produto</h3>
            <input
              className="gestao-input"
              type="text"
              name="nome"
              placeholder="Nome"
              value={produto.nome}
              onChange={handleProdutoChange}
              required
            />
            <input
              className="gestao-input"
              type="number"
              name="preco"
              placeholder="Preço"
              step="0.01"
              value={produto.preco}
              onChange={handleProdutoChange}
              required
            />
            <input
              className="gestao-input"
              type="number"
              name="quantidade"
              placeholder="Quantidade"
              value={produto.quantidade}
              onChange={handleProdutoChange}
              required
            />

            <button type="submit" className="gestao-button">
              Salvar Produto
            </button>
            <button
              type="button"
              className="gestao-button gestao-button-cancelar"
              onClick={() => setShowProdutoForm(false)}
            >
              Cancelar
            </button>

            {msgProduto && <p className="gestao-msg">{msgProduto}</p>}
          </form>
        )}

        {!showProdutoForm && (
          <>
            <h4>Produtos cadastrados:</h4>
            <div className="gestao-lista">
              {produtos.length === 0 ? (
                <p>Nenhum produto cadastrado.</p>
              ) : (
                <table className="gestao-tabela">
                  <thead>
                    <tr>
                      <th className="gestao-thtd">Nome</th>
                      <th className="gestao-thtd">Preço</th>
                      <th className="gestao-thtd">Quantidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.map((p) => (
                      <tr key={p.id}>
                        <td className="gestao-thtd">{p.nome}</td>
                        <td className="gestao-thtd">R$ {parseFloat(p.preco).toFixed(2)}</td>
                        <td className="gestao-thtd">{p.quantidade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Gestao;