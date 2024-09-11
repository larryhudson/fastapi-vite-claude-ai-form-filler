from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from services.pdf_service import PDFService
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pdf_service = PDFService()

@app.get("/")
async def root():
    logger.debug("Root endpoint accessed")
    return {"message": "Welcome to the AI-Assisted Form Filling API"}

from fastapi import Form
import json

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...), schema: str = Form(...)):
    logger.debug(f"Received file: {file.filename}")
    logger.debug(f"Received schema: {schema}")
    try:
        # Create an 'uploads' directory if it doesn't exist
        os.makedirs("uploads", exist_ok=True)
        logger.debug("Created 'uploads' directory")
        
        # Save the uploaded file
        file_path = f"uploads/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        logger.debug(f"Saved file to {file_path}")
        
        # Parse the JSON schema
        json_schema = json.loads(schema)
        logger.debug(f"Parsed JSON schema: {json_schema}")
        
        # Process the PDF with the schema
        logger.debug("Processing PDF with schema")
        result = pdf_service.process_pdf(file_path, json_schema)
        logger.debug(f"PDF processing result: {result}")
        
        return {"filename": file.filename, "status": "File processed successfully", "result": result}
    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting the server")
    uvicorn.run(app, host="0.0.0.0", port=8000)
