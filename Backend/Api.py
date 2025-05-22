from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
import os
import re
from dotenv import load_dotenv

# Carrega as variáveis do arquivo .env
load_dotenv()

# Configura a API key do Gemini
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    raise ValueError("A variável de ambiente GEMINI_API_KEY não está definida.")

client = genai.Client(api_key=api_key)

app = Flask(__name__)
CORS(app)

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

# Gera uma resposta curta e objetiva
def gerar_resposta_formatada(pergunta):
    prompt = f"""
Responda de forma curta, clara e objetiva, usando marcadores simples.
Pergunta: "{pergunta}"
"""
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )
    return formatar_em_html(response.text)

def formatar_em_html(texto):
    """
    Formata a resposta em HTML para uma aparência mais amigável:
    - Negrito com <strong>
    - Listas com marcadores HTML (<ul><li>)
    - Quebras de linha com <br>
    - Envolvimento em <div> com classe para estilização
    """
    texto = texto.strip()
    
    # Negrito com **texto**
    texto = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', texto)

    # Quebra de linha com <br>
    texto = texto.replace('\n', '<br>')

    # Captura listas marcadas com "* "
    padrao_lista = r'(?:\* .+(?:<br>)?)+'
    listas_encontradas = re.findall(padrao_lista, texto)

    for bloco in listas_encontradas:
        itens = re.findall(r'\* (.+?)(?:<br>|$)', bloco)
        lista_html = "<ul style='padding-left: 1.2rem; margin: 0.5rem 0;'>"
        lista_html += "".join(f"<li style='margin-bottom: 0.4rem;'>{item.strip()}</li>" for item in itens)
        lista_html += "</ul>"
        texto = texto.replace(bloco, lista_html)

    # Envolve tudo em um <div> estilizado
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



# Rota principal da API
@app.route('/pergunta', methods=['POST'])
def pergunta():
    dados = request.get_json()
    pergunta = dados.get("pergunta") if dados else None

    if not pergunta:
        return jsonify({"erro": "Pergunta inválida"}), 400

    if not is_ecommerce_related(pergunta):
        return jsonify({"erro": "A pergunta não está relacionada ao e-commerce."}), 400

    try:
        resposta = gerar_resposta_formatada(pergunta)
        return jsonify({"pergunta": pergunta, "resposta": resposta})
    except Exception as e:
        return jsonify({"erro": f"Erro ao processar a pergunta: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
