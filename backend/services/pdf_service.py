import os
import base64
from pdf2image import convert_from_path
from anthropic import Anthropic

class PDFService:
    def __init__(self):
        self.anthropic = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    def convert_pdf_to_image(self, pdf_path):
        images = convert_from_path(pdf_path)
        image_path = pdf_path.replace('.pdf', '.png')
        images[0].save(image_path, 'PNG')
        return image_path

    def process_image_with_anthropic(self, image_path, json_schema):
        with open(image_path, 'rb') as image_file:
            image_base64 = base64.b64encode(image_file.read()).decode('utf-8')

        response = self.anthropic.messages.create(
            model="claude-3-sonnet-20240229",
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

        # Extract the tool call result from the response
        tool_call = response.content[0].tool_calls[0]
        return tool_call.input

    def process_pdf(self, pdf_path, json_schema):
        image_path = self.convert_pdf_to_image(pdf_path)
        result = self.process_image_with_anthropic(image_path, json_schema)
        return result
