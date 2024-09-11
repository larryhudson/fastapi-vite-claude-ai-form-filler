# AI-Assisted Form Filler

This project is a web application that uses AI to assist users in filling out forms by extracting information from uploaded PDF documents. It consists of a FastAPI Python backend and a Vite + React frontend.

## Features

- User-friendly web interface with a customizable form
- PDF document upload functionality
- AI-powered form filling based on uploaded PDF content
- Integration with Anthropic's AI API for intelligent data extraction

## Prerequisites

- Python 3.8+
- Node.js 14+
- Anthropic API key

## Setup

### Backend

1. Clone the repository and navigate to the backend directory:

   ```
   git clone <repository-url>
   cd <project-directory>/backend
   ```

2. Create a virtual environment and activate it:

   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install the required Python packages:

   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory and add your Anthropic API key:

   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

### Frontend

1. Navigate to the frontend directory:

   ```
   cd ../frontend
   ```

2. Install the required npm packages:

   ```
   npm install
   ```

## Running the Application

1. Start the backend server:

   ```
   cd backend
   uvicorn main:app --reload
   ```

2. In a new terminal, start the frontend development server:

   ```
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173` to use the application.

## How It Works

### Backend

The backend uses FastAPI to handle API requests and process PDF files. Here's a key example of how the PDF processing works:

```python
class PDFService:
    def process_pdf(self, pdf_path, json_schema):
        image_path = self.convert_pdf_to_image(pdf_path)
        result = self.process_image_with_anthropic(image_path, json_schema)
        return result

    def process_image_with_anthropic(self, image_path, form_schema):
        with open(image_path, 'rb') as image_file:
            image_base64 = base64.b64encode(image_file.read()).decode('utf-8')

        response = self.anthropic.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=1024,
            tools=[{
                "name": "extract_form_data",
                "description": "Extract form data from an image using well-structured JSON.",
                "input_schema": form_schema
            }],
            tool_choice={"type": "tool", "name": "extract_form_data"},
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": "image/png",
                                "data": image_base64
                            }
                        },
                        {
                            "type": "text",
                            "text": "Extract the form data from this image according to the provided schema."
                        }
                    ]
                }
            ]
        )

        if response.content[0].type == "tool_use":
            tool_call = response.content[0]
            return tool_call.input
```

### Frontend

The frontend uses React with react-hook-form for form handling. Here's a key example of how the form submission and PDF upload work:

```jsx
const handleFileUpload = async () => {
  if (!file) {
    setUploadStatus('Please select a file first.');
    return;
  }

  setIsLoading(true);
  setUploadStatus('Processing PDF...');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('schema', JSON.stringify(jsonSchema));

  try {
    const response = await fetch('http://localhost:8000/upload-pdf', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setUploadStatus('File processed successfully!');
    console.log(data);

    // Fill the form with the received data
    if (data.result) {
      Object.keys(data.result).forEach((key) => {
        setValue(key as keyof FormInputs, data.result[key]);
      });
    }
  } catch (error) {
    setUploadStatus('Error processing file.');
    console.error('Error:', error);
  } finally {
    setIsLoading(false);
  }
};
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
