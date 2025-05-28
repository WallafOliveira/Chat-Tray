from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)  

DB_NAME = 'ecommerce.db'

def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            telefone TEXT,
            cidade TEXT,
            estado TEXT,
            cep TEXT
        )
    ''')

    c.execute('''
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            preco REAL NOT NULL,
            quantidade INTEGER NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/api/clientes', methods=['POST'])
def add_cliente():
    data = request.json
    nome = data.get('nome')
    email = data.get('email')
    telefone = data.get('telefone')
    cidade = data.get('cidade')
    estado = data.get('estado')
    cep = data.get('cep')

    if not nome or not email or not telefone:
        return jsonify({'erro': 'Dados obrigatórios incompletos'}), 400

    try:
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        c.execute('''
            INSERT INTO clientes (nome, email, telefone, cidade, estado, cep)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (nome, email, telefone, cidade, estado, cep))
        conn.commit()
        conn.close()
        return jsonify({'sucesso': 'Cliente cadastrado com sucesso!'})
    except sqlite3.IntegrityError:
        return jsonify({'erro': 'Email já cadastrado'}), 400

@app.route('/api/clientes', methods=['GET'])
def listar_clientes():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT * FROM clientes")
    clientes = [dict(id=row[0], nome=row[1], email=row[2], telefone=row[3], cidade=row[4], estado=row[5], cep=row[6]) for row in c.fetchall()]
    conn.close()
    return jsonify(clientes)
  


@app.route('/api/produtos', methods=['POST'])
def add_produto():
    data = request.json
    nome = data.get('nome')
    preco = data.get('preco')
    quantidade = data.get('quantidade')

    if not nome or preco is None or quantidade is None:
        return jsonify({'erro': 'Dados incompletos'}), 400

    try:
        preco = float(preco)
        quantidade = int(quantidade)
    except ValueError:
        return jsonify({'erro': 'Preço ou quantidade inválidos'}), 400

    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("INSERT INTO produtos (nome, preco, quantidade) VALUES (?, ?, ?)", (nome, preco, quantidade))
    conn.commit()
    conn.close()
    return jsonify({'sucesso': 'Produto cadastrado com sucesso!'})



@app.route('/api/produtos', methods=['GET'])
def listar_produtos():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM produtos")
    rows = c.fetchall()
    conn.close()
    produtos = [dict(row) for row in rows]
    return jsonify(produtos)


if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5001)
