import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
import MetaTrader5 as mt5

nltk.download('vader_lexicon')

def initialize_mt5():
    if not mt5.initialize():
        print("Falha ao inicializar o MetaTrader 5")
        mt5.shutdown()
        return False
    return True

def fetch_news():
    if not initialize_mt5():
        return []
    
    news = mt5.news_get()
    mt5.shutdown()
    return news

def analyze_sentiment(text):
    sia = SentimentIntensityAnalyzer()
    return sia.polarity_scores(text)

def get_market_sentiment():
    news_items = fetch_news()
    if not news_items:
        return "Neutral"
    
    sentiments = [analyze_sentiment(item.headline) for item in news_items]
    avg_sentiment = sum(s['compound'] for s in sentiments) / len(sentiments)
    
    if avg_sentiment > 0.05:
        return "Positive"
    elif avg_sentiment < -0.05:
        return "Negative"
    else:
        return "Neutral"