from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import base64
import numpy as np
import cv2
import pickle
import os

app = FastAPI()

# Load the trained model
MODEL_PATH = "emnist_model.pkl"
clf = None
if os.path.exists(MODEL_PATH):
    print("Loading EMNIST model...")
    with open(MODEL_PATH, "rb") as f:
        clf = pickle.load(f)
    print("Model loaded successfully.")
else:
    print("WARNING: emnist_model.pkl not found.")

# Allow CORS so the frontend can communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImagePayload(BaseModel):
    image: str

@app.post("/api/recognize")
async def recognize_digit(payload: ImagePayload):
    try:
        if "," in payload.image:
            base64_data = payload.image.split(",")[1]
        else:
            base64_data = payload.image
            
            
        # 2. Decode it into a numpy array
        img_data = base64.b64decode(base64_data)
        np_arr = np.frombuffer(img_data, np.uint8)
        
        # 3. Decode into OpenCV image
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Failed to decode image")

        # 4. Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # 5. Thresholding (invert: black background, white strokes)
        # Assuming the incoming image is dark strokes on light background
        _, thresh = cv2.threshold(gray, 128, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)
        
        # Dilate slightly to connect thin strokes if needed
        kernel = np.ones((3, 3), np.uint8)
        thresh = cv2.dilate(thresh, kernel, iterations=1)

        # 6. Find contours (the individual digits)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        boxes = []
        for c in contours:
            x, y, w, h = cv2.boundingRect(c)
            # Filter out tiny noise (e.g., dots)
            if w > 10 and h > 10:
                boxes.append((x, y, w, h))
        
        # Sort bounding boxes left-to-right
        boxes = sorted(boxes, key=lambda b: b[0])

        recognized_str = ""

        # Process each digit individually
        for i, (x, y, w, h) in enumerate(boxes):
            # Extract the digit using the bounding box
            digit_roi = thresh[y:y+h, x:x+w]
            
            # Pad the digit to make it square-ish (like MNIST)
            max_dim = max(w, h)
            pad_x = (max_dim - w) // 2
            pad_y = (max_dim - h) // 2
            # Add extra padding so the digit isn't touching the edge
            padding = int(max_dim * 0.2) 
            padded = cv2.copyMakeBorder(
                digit_roi, 
                pad_y + padding, pad_y + padding, 
                pad_x + padding, pad_x + padding, 
                cv2.BORDER_CONSTANT, value=0
            )

            # Resize to 28x28 (MNIST format)
            resized = cv2.resize(padded, (28, 28), interpolation=cv2.INTER_AREA)
            
            # Predict
            if clf is None:
                raise ValueError("Model not loaded")
                
            # Flatten the image to 1D array of 784 pixels
            features = resized.flatten().reshape(1, -1)
            # MNIST model expects roughly 0-255 range
            prediction = clf.predict(features)
            predicted_digit = str(prediction[0])
                
            recognized_str += predicted_digit
            
        if not recognized_str:
            recognized_str = ""
            
        return {"digit": recognized_str} 
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
