import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import joblib
import os

# For this demonstration, we'll create a synthetic dataset if one doesn't exist
# In a real scenario, we would load the 'myPersonality' or 'Big Five' dataset.
def generate_synthetic_data(n_samples=1000):
    np.random.seed(42)
    # 5 traits, 15 questions (3 per trait)
    # Answers are 1-5
    X = np.random.randint(1, 6, size=(n_samples, 15))
    
    # Simple linear relationship for synthesis
    # trait = mean(related_questions) / 5 (normalized 0-1)
    y = np.zeros((n_samples, 5))
    for i in range(5):
        # Each trait is derived from 3 questions
        q_indices = [i, i+5, i+10]
        y[:, i] = X[:, q_indices].mean(axis=1) / 5.0
        
    cols = [f"Q{i+1}" for i in range(15)]
    X_df = pd.DataFrame(X, columns=cols)
    y_cols = ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"]
    y_df = pd.DataFrame(y, columns=y_cols)
    
    return X_df, y_df

def train_and_save_model():
    X, y = generate_synthetic_data()
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    os.makedirs("backend/model/saved", exist_ok=True)
    joblib.dump(model, "backend/model/saved/personality_model.joblib")
    print("Model trained and saved successfully.")

if __name__ == "__main__":
    train_and_save_model()
