import sys
import MetaTrader5 as mt5
from dotenv import load_dotenv
import os

def test_mt5_connection():
    # Inicializar MT5
    if not mt5.initialize():
        print("Erro ao inicializar MT5:", mt5.last_error())
        return False
    
    # Verificar conexão
    if not mt5.terminal_info():
        print("Terminal MT5 não está conectado")
        return False
    
    print("Conexão MT5 estabelecida com sucesso!")
    print("Versão:", mt5.version())
    
    # Tentar obter dados do símbolo EURUSD
    symbol = "EURUSD"
    symbol_info = mt5.symbol_info(symbol)
    
    if symbol_info is not None:
        print(f"Símbolo {symbol} encontrado!")
        print(f"Preço atual: {symbol_info.last}")
    else:
        print(f"Símbolo {symbol} não encontrado")
    
    return True

def test_api_connection():
    import requests
    try:
        response = requests.get("http://localhost:8000/health")
        if response.status_code == 200:
            print("API está funcionando!")
            return True
        else:
            print(f"API retornou status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("Não foi possível conectar à API")
        return False

if __name__ == "__main__":
    print("Testando conexões...")
    
    # Testar MT5
    mt5_ok = test_mt5_connection()
    
    # Testar API
    api_ok = test_api_connection()
    
    if mt5_ok and api_ok:
        print("\nTodas as conexões estão funcionando!")
        sys.exit(0)
    else:
        print("\nAlgumas conexões falharam. Verifique os logs acima.")
        sys.exit(1)