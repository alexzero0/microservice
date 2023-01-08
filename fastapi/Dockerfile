FROM python:3.9-alpine

WORKDIR /app

EXPOSE 8000

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY *.py .

# RUN python main.py
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]