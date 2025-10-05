FROM python:3.9-alpine

WORKDIR /app

RUN apk add --no-cache \
    gcc \
    musl-dev \
    libffi-dev \
    openssl-dev

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ingesta_api.py .

CMD ["python", "ingesta_api.py"]