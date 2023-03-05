FROM python:3.9-alpine

# RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app/

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade pip

# COPY requirements.txt requirements.txt
COPY . .

RUN pip install -r requirements.txt

# COPY . .


# FROM python:3.9-alpine

# WORKDIR /app

# EXPOSE 8000

# COPY requirements.txt requirements.txt

# RUN pip install -r requirements.txt

# COPY *.py .

# # RUN python main.py
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]