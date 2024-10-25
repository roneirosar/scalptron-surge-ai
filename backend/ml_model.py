import numpy as np
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, BatchNormalization
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
import joblib

class TradingLSTM:
    def __init__(self, sequence_length=60, n_features=6):
        self.sequence_length = sequence_length
        self.n_features = n_features
        self.model = None
        self.scaler = MinMaxScaler(feature_range=(0, 1))
        
    def build_model(self):
        model = Sequential([
            LSTM(128, return_sequences=True, input_shape=(self.sequence_length, self.n_features)),
            BatchNormalization(),
            Dropout(0.2),
            
            LSTM(256, return_sequences=True),
            BatchNormalization(),
            Dropout(0.2),
            
            LSTM(128, return_sequences=False),
            BatchNormalization(),
            Dropout(0.2),
            
            Dense(64, activation='relu'),
            BatchNormalization(),
            Dropout(0.1),
            
            Dense(32, activation='relu'),
            BatchNormalization(),
            
            Dense(1)
        ])
        
        optimizer = Adam(learning_rate=0.001)
        model.compile(optimizer=optimizer, loss='mse', metrics=['mae'])
        self.model = model
        return model
    
    def prepare_data(self, data):
        scaled_data = self.scaler.fit_transform(data)
        X, y = [], []
        
        for i in range(self.sequence_length, len(scaled_data)):
            X.append(scaled_data[i-self.sequence_length:i])
            y.append(scaled_data[i, 0])  # Assuming first column is the target
            
        return np.array(X), np.array(y)
    
    def train(self, X_train, y_train, validation_split=0.2, epochs=100, batch_size=32):
        callbacks = [
            EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True),
            ModelCheckpoint('best_model.h5', monitor='val_loss', save_best_only=True)
        ]
        
        history = self.model.fit(
            X_train, y_train,
            validation_split=validation_split,
            epochs=epochs,
            batch_size=batch_size,
            callbacks=callbacks,
            verbose=1
        )
        return history
    
    def predict(self, X):
        predictions = self.model.predict(X)
        return self.scaler.inverse_transform(predictions.reshape(-1, 1))
    
    def save(self, model_path='model', scaler_path='scaler.pkl'):
        self.model.save(model_path)
        joblib.dump(self.scaler, scaler_path)
    
    def load(self, model_path='model', scaler_path='scaler.pkl'):
        self.model = tf.keras.models.load_model(model_path)
        self.scaler = joblib.load(scaler_path)