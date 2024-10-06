import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
import random  # For demonstration purposes

nltk.download('vader_lexicon', quiet=True)

def get_market_sentiment():
    # In a real scenario, you would fetch and analyze actual market news
    # For demonstration, we'll return a random sentiment
    sentiments = ['Positive', 'Neutral', 'Negative']
    return random.choice(sentiments)