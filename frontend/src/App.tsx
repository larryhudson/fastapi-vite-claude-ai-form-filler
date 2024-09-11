import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { FieldValues } from 'react-hook-form';
import './App.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const API_BASE_URL = 'http://localhost:8000';

// How It Works component
const HowItWorks: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const frontendCode = `
const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  // ... other fields
});

type FormInputs = z.infer<typeof formSchema>;

const {
  register,
  handleSubmit,
  formState: { errors },
  setValue
} = useForm<FormInputs>({
  resolver: zodResolver(formSchema),
});
  `.trim();

  const backendCode = `
@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...), schema: str = Form(...)):
    # Save the uploaded file
    file_path = f"uploads/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Process the PDF with the schema
    result = pdf_service.process_pdf(file_path, json.loads(schema))
    
    return {"filename": file.filename, "status": "File processed successfully", "result": result}
  `.trim();

  const processPdfCode = `
def process_pdf(self, pdf_path, json_schema):
    # Convert PDF to image
    image_path = self.convert_pdf_to_image(pdf_path)
    
    # Read image and encode to base64
    with open(image_path, 'rb') as image_file:
        image_base64 = base64.b64encode(image_file.read()).decode('utf-8')
    
    # Send request to Claude API
    response = self.anthropic.messages.create(
        model="claude-3-5-sonnet-20240620",
        max_tokens=1024,
        tools=[{
            "name": "extract_form_data",
            "description": "Extract form data from an image using well-structured JSON.",
            "input_schema": json_schema
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
    
    # Extract and return the tool call result
    if response.content[0].type == "tool_use":
        return response.content[0].input
  `.trim();

  return (
    <div className="how-it-works">
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Hide How It Works' : 'Show How It Works'}
      </button>
      {isOpen && (
        <div className="how-it-works-content">
          <h3>How This Works</h3>
          <p>
            This application demonstrates AI-assisted form filling using React on the frontend and FastAPI with Anthropic's Claude API on the backend.
          </p>
          <h4>Frontend (React + TypeScript)</h4>
          <p>The form is defined using react-hook-form and Zod for schema validation:</p>
          <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
            {frontendCode}
          </SyntaxHighlighter>
          <h4>Backend (FastAPI + Python)</h4>
          <p>The backend processes the uploaded PDF and uses Claude API for data extraction:</p>
          <SyntaxHighlighter language="python" style={vscDarkPlus}>
            {backendCode}
          </SyntaxHighlighter>
          <p>
            The 'process_pdf' function in the PDFService class handles the PDF processing and interaction with Claude:
          </p>
          <ol>
            <li>It converts the PDF to an image using the pdf2image library.</li>
            <li>The image is then encoded to base64 format.</li>
            <li>A request is sent to Claude API using the Anthropic SDK, including:
              <ul>
                <li>The base64-encoded image</li>
                <li>A tool definition for extracting form data</li>
                <li>The JSON schema defining the expected form structure</li>
              </ul>
            </li>
            <li>Claude processes the image and extracts the form data according to the provided schema.</li>
            <li>The extracted data is returned to the frontend to populate the form.</li>
          </ol>
          <p>
            Here's a simplified example of the 'process_pdf' function:
          </p>
          <SyntaxHighlighter language="python" style={vscDarkPlus}>
            {processPdfCode}
          </SyntaxHighlighter>
          <p>
            This approach leverages Claude's advanced image processing and natural language understanding capabilities to accurately extract structured data from the uploaded PDF.
          </p>
        </div>
      )}
    </div>
  );
};

// Define the Zod schema for the main form
const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  income: z.number().min(0, 'Income must be a positive number'),
  expenses: z.number().min(0, 'Expenses must be a positive number'),
});

// Infer the TypeScript type from the schema
type FormInputs = z.infer<typeof formSchema>;

// Generate JSON schema using zod-to-json-schema
const jsonSchema = zodToJsonSchema(formSchema, { name: 'FormSchema' });

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormInputs) => {
    console.log(data);
    console.log('JSON Schema:', JSON.stringify(jsonSchema, null, 2));
    // Here you would typically send the data to your backend
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

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

  return (
    <div className="App">
      <h1>AI-Assisted Form Filling</h1>
      <HowItWorks />
      <div>
        <h2>Upload PDF</h2>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <button onClick={handleFileUpload} disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Upload'}
        </button>
        <button onClick={() => window.open(`${API_BASE_URL}/download-example-pdf`, '_blank')}>
          Download Example PDF
        </button>
        {uploadStatus && <p>{uploadStatus}</p>}
        {isLoading && <div className="loader"></div>}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input {...register('firstName')} />
          {errors.firstName && <span>{errors.firstName.message}</span>}
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input {...register('lastName')} />
          {errors.lastName && <span>{errors.lastName.message}</span>}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input {...register('email')} />
          {errors.email && <span>{errors.email.message}</span>}
        </div>
        <div>
          <label htmlFor="phone">Phone:</label>
          <input {...register('phone')} />
          {errors.phone && <span>{errors.phone.message}</span>}
        </div>
        <div>
          <label htmlFor="income">Annual Income:</label>
          <input type="number" {...register('income', { valueAsNumber: true })} />
          {errors.income && <span>{errors.income.message}</span>}
        </div>
        <div>
          <label htmlFor="expenses">Monthly Expenses:</label>
          <input type="number" {...register('expenses', { valueAsNumber: true })} />
          {errors.expenses && <span>{errors.expenses.message}</span>}
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
