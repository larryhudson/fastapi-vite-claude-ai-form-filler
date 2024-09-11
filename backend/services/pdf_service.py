import os
from pdf2image import convert_from_path
from anthropic import Anthropic, HUMAN_PROMPT, AI_PROMPT

class PDFService:
    def __init__(self):
        self.anthropic = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    def convert_pdf_to_image(self, pdf_path):
        images = convert_from_path(pdf_path)
        image_path = pdf_path.replace('.pdf', '.png')
        images[0].save(image_path, 'PNG')
        return image_path

    def process_image_with_anthropic(self, image_path):
        with open(image_path, 'rb') as image_file:
            response = self.anthropic.completions.create(
                model="claude-2",
                max_tokens_to_sample=300,
                prompt=f"{HUMAN_PROMPT}Here's an image of a form. Please extract the relevant information and return it as a JSON object.{AI_PROMPT}",
                image=image_file
            )
        return response.completion

    def process_pdf(self, pdf_path):
        image_path = self.convert_pdf_to_image(pdf_path)
        result = self.process_image_with_anthropic(image_path)
        return result
