import gzip
import numpy as np
import pickle
import os

def load_emnist(image_path, label_path):
    print(f"Loading images from {image_path}...")
    with gzip.open(image_path, 'rb') as f:
        # Skip magic number and dimensions (16 bytes)
        X = np.frombuffer(f.read(), np.uint8, offset=16).reshape(-1, 784)
        
    print(f"Loading labels from {label_path}...")
    with gzip.open(label_path, 'rb') as f:
        # Skip magic number and dimensions (8 bytes)
        y = np.frombuffer(f.read(), np.uint8, offset=8)
        
    return X, y

if __name__ == "__main__":
    # Path to EMNIST Digits dataset provided in the workspace
    DATA_DIR = "../math-explorer/datasets"
    TRAIN_IMAGES = os.path.join(DATA_DIR, "emnist-digits-train-images-idx3-ubyte.gz")
    TRAIN_LABELS = os.path.join(DATA_DIR, "emnist-digits-train-labels-idx1-ubyte.gz")

    if not os.path.exists(TRAIN_IMAGES) or not os.path.exists(TRAIN_LABELS):
        print("ERROR: EMNIST dataset files not found. Please ensure they exist.")
        exit(1)

    print("Loading EMNIST Digits training data into memory...")
    X, y = load_emnist(TRAIN_IMAGES, TRAIN_LABELS)

    # EMNIST digits are transposed. We need to flip/rotate them back appropriately.
    # Usually EMNIST needs a rotate 90 and flip. Here we reshape, transpose, and flatten back.
    print("Normalizing and transposing EMNIST data to standard orientation...")
    num_samples = X.shape[0]
    X_reshaped = X.reshape(num_samples, 28, 28)
    X_transposed = np.array([np.transpose(img) for img in X_reshaped])
    X = X_transposed.reshape(num_samples, 784)

    # Train model on the full dataset for maximum accuracy
    num_train = len(X)
    X_train = X[:num_train]
    y_train = y[:num_train]
    
    print(f"Training MLP classifier on {num_train} samples. This will take a few minutes...")
    from sklearn.neural_network import MLPClassifier
    model = MLPClassifier(
        hidden_layer_sizes=(100,), 
        max_iter=150, 
        alpha=1e-4, 
        solver='adam', 
        verbose=10, 
        random_state=1, 
        learning_rate_init=.001
    )
    model.fit(X_train, y_train)
    
    print("Saving model...")
    with open('emnist_model.pkl', 'wb') as f:
        pickle.dump(model, f)
        
    print("Model saved to emnist_model.pkl")
    print("Training script completed successfully.")
