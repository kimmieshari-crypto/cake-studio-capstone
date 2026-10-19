# Start with a lightweight Python image.
FROM python:3.12-slim
WORKDIR /app
# Install the Python dependencies before copying app code for better build caching.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# Include templates and static files in the image.
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
