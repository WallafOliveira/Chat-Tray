from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
import os
import re
import pandas as pd
from docx import Document
from pathlib import Path
from dotenv import load_dotenv
import sqlite3

# Carrega as variáveis do .env
load_dotenv()

# Configura a API key do Gemini
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    raise ValueError("A variável de ambiente GEMINI_API_KEY não está definida.")

client = genai.Client(api_key=api_key)

app = Flask(__name__)
CORS(app)

DB_NAME = 'ecommerce.db'

# Verifica se a pergunta é sobre e-commerce
def is_ecommerce_related(pergunta):
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[f"Essa pergunta está relacionada ao e-commerce? Responda apenas com 'sim' ou 'não'. Pergunta: {pergunta}"]
        )
        return response.text.strip().lower() == "sim"
    except:
        return False

# Leitura de diferentes tipos de arquivos
def ler_documento(arquivo, nome_arquivo):
    try:
        extensao = Path(nome_arquivo).suffix.lower()
        if extensao == ".csv":
            return pd.read_csv(arquivo)
        elif extensao == ".json":
            return pd.read_json(arquivo)
        elif extensao == ".txt":
            return pd.read_table(arquivo)
        elif extensao in [".xlsx", ".xls", ".xlsm", ".xlsb", ".xltx", ".xltm"]:
            return pd.read_excel(arquivo)
        elif extensao == ".html":
            return pd.read_html(arquivo)[0]
        elif extensao == ".docx":
            doc = Document(arquivo)
            textos = [p.text for p in doc.paragraphs if p.text.strip() != ""]
            return pd.DataFrame({"Texto": textos})
        else:
            raise ValueError("Formato de arquivo não suportado.")
    except Exception as e:
        raise ValueError(f"Erro ao ler o arquivo: {str(e)}")

# Geração da resposta com base nos dados
def gerar_resposta_formatada(pergunta, dados_planilha=None):
    contexto = ""
    if dados_planilha is not None:
        resumo = dados_planilha.head(5).to_string(index=False)
        contexto = f"\nAqui estão alguns dados relevantes da planilha:\n{resumo}\n"

    prompt = f"""
Responda de forma curta, clara e objetiva, usando marcadores simples.
Pergunta: "{pergunta}"
{contexto}
"""
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )
    return formatar_em_html(response.text)

# Formata a resposta com HTML estilizado
def formatar_em_html(texto):
    texto = texto.strip()
    texto = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', texto)
    texto = texto.replace('\n', '<br>')

    padrao_lista = r'(?:\* .+(?:<br>)?)+'
    listas_encontradas = re.findall(padrao_lista, texto)

    for bloco in listas_encontradas:
        itens = re.findall(r'\* (.+?)(?:<br>|$)', bloco)
        lista_html = "<ul style='padding-left: 1.2rem; margin: 0.5rem 0;'>"
        lista_html += "".join(f"<li style='margin-bottom: 0.4rem;'>{item.strip()}</li>" for item in itens)
        lista_html += "</ul>"
        texto = texto.replace(bloco, lista_html)

    html = f"""
    <div style="
        background-color: #111827;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        font-family: sans-serif;
        font-size: 1rem;
        line-height: 1.6;
    ">
        {texto}
    </div>
    """
    return html

# Rota principal
@app.route('/pergunta', methods=['POST'])
def pergunta():
    dados = request.get_json(silent=True)
    pergunta = None
    arquivo = None

    if dados:
        pergunta = dados.get("pergunta")
    else:
        pergunta = request.form.get("pergunta")
        arquivo = request.files.get("anexo")

    if not pergunta:
        return jsonify({"erro": "Pergunta inválida"}), 400

    if not is_ecommerce_related(pergunta):
        return jsonify({"erro": "A pergunta não está relacionada ao e-commerce."}), 400

    dados_planilha = None
    dados_convertidos = []

    if arquivo:
        try:
            dados_planilha = ler_documento(arquivo, arquivo.filename)
            dados_convertidos = dados_planilha.fillna("").to_dict(orient="records")
        except Exception as e:
            return jsonify({"erro": str(e)}), 400

    cadastro_realizado = False
    try:
        if dados_convertidos:
            conn = sqlite3.connect(DB_NAME)
            c = conn.cursor()

            if "cliente" in pergunta.lower():
                for item in dados_convertidos:
                    try:
                        c.execute('''
                            INSERT INTO clientes (nome, email, telefone, cidade, estado, cep)
                            VALUES (?, ?, ?, ?, ?, ?)
                        ''', (
                            item.get('Nome') or item.get('nome'),
                            item.get('Email') or item.get('email'),
                            item.get('Telefone') or item.get('telefone'),
                            item.get('Cidade') or item.get('cidade'),
                            item.get('Estado') or item.get('estado'),
                            item.get('CEP') or item.get('cep')
                        ))
                    except sqlite3.IntegrityError:
                        continue
                cadastro_realizado = True

            elif "produto" in pergunta.lower():
                for item in dados_convertidos:
                    try:
                        c.execute('''
                            INSERT INTO produtos (nome, preco, quantidade)
                            VALUES (?, ?, ?)
                        ''', (
                            item.get('Nome') or item.get('nome'),
                            float(item.get('Preço') or item.get('preco')),
                            int(item.get('Quantidade') or item.get('quantidade'))
                        ))
                    except (ValueError, TypeError):
                        continue
                cadastro_realizado = True

            conn.commit()
            conn.close()

    except Exception as e:
        return jsonify({"erro": f"Erro ao cadastrar dados: {str(e)}"}), 500

    try:
        resposta = gerar_resposta_formatada(pergunta, dados_planilha)
        resposta_json = {
            "pergunta": pergunta,
            "resposta": resposta
        }
        if dados_convertidos:
            resposta_json["dados_recebidos"] = dados_convertidos
        if cadastro_realizado:
            resposta_json["cadastro"] = "Dados cadastrados com sucesso."

        return jsonify(resposta_json)
    except Exception as e:
        return jsonify({"erro": f"Erro ao processar a pergunta: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True)
