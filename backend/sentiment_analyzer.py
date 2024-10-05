import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
import requests
from bs4 import BeautifulSoup

nltk.download('vader_lexicon')

def fetch_news(symbol):
    # Simulated news fetching - replace with actual API call
    url = f"https://example.com/finance/news/{symbol}"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    news_items = soup.find_all('div', class_='news-item')
    return [item.text for item in news_items]

def analyze_sentiment(text):
    sia = SentimentIntensityAnalyzer()
    return sia.polarity_scores(text)

def get_market_sentiment(symbol):
    news_items = fetch_news(symbol)
    sentiments = [analyze_sentiment(item) for item in news_items]
    avg_sentiment = sum(s['compound'] for s in sentiments) / len(sentiments)
    
    if avg_sentiment > 0.05:
        return "Positive"
    elif avg_sentiment < -0.05:
        return "Negative"
    else:
        return "Neutral"