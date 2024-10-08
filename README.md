# AI-Assisted Form Filler Example

This project demonstrates a simple example of how to create an AI-assisted form filling application using React, react-hook-form, Zod, and Anthropic's Claude API. It showcases how to define a form using react-hook-form and a Zod schema, allow users to upload a PDF with information, and automatically fill in the form using Claude's AI capabilities.

## Key Features

- Form definition using react-hook-form and Zod schema
- PDF upload functionality
- Automatic form filling using Anthropic's Claude API
- Utilization of Claude's tool use feature for structured JSON data extraction
- Download example PDF feature for user reference

## How It Works

1. **Form Definition**: The form is defined using react-hook-form and a Zod schema, ensuring type safety and easy validation.

2. **PDF Upload**: Users can upload a PDF containing relevant information for the form.

3. **AI Processing**: The backend converts the PDF to an image and sends it to Claude API.

4. **Data Extraction**: Claude's tool use feature is employed to request JSON data in the correct format for the form.

5. **Automatic Form Filling**: The extracted data is used to automatically populate the form fields.

## Key Components

### Frontend (React + TypeScript)

- Uses react-hook-form for form management
- Implements Zod for schema definition and validation
- Handles PDF upload and form population

### Backend (FastAPI)

- Processes uploaded PDFs
- Interacts with Claude API for data extraction
- Returns structured data to the frontend

### AI Integration (Claude API)

- Utilizes Claude's tool use feature for structured data extraction
- Processes images and returns JSON data matching the form schema

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-assisted-form-filler.git
   cd ai-assisted-form-filler
   ```

2. Set up the backend:
   - Install Python dependencies:
     ```bash
     python -m venv venv
     source venv/bin/activate  # On Windows use `venv\Scripts\activate`
     pip install -r requirements.txt
     ```
   - Configure your Anthropic API key:
     ```bash
     export ANTHROPIC_API_KEY=your_api_key_here
     ```

3. Set up the frontend:
   - Install npm packages:
     ```bash
     cd frontend
     npm install
     ```
   - Start the development server:
     ```bash
     npm start
     ```

4. Run the backend server:
   ```bash
   cd ../backend
   uvicorn main:app --reload
   ```

5. Open your browser and navigate to `http://localhost:3000` to use the application.

6. Experiment with PDF uploads and form filling.

For more detailed setup instructions and configuration options, refer to the Setup section below.

## Contributing

Contributions to improve this example are welcome. Please feel free to submit a Pull Request or open an Issue for discussion.

## License

This project is licensed under the MIT License.
