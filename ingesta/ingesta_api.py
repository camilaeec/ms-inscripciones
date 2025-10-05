import boto3
import requests
import json
import os
from datetime import datetime
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Configuración
API_BASE_URL = os.getenv('API_URL', 'http://app:3000')
S3_BUCKET_NAME = os.getenv('S3_BUCKET', 'inscripciones-data-2025-camila')
AWS_REGION = os.getenv('AWS_REGION', 'us-east-1')

def obtener_datos_inscripciones():
    """Obtiene todas las inscripciones desde la API"""
    try:
        print(f"📡 Conectando a: {API_BASE_URL}/inscripciones")
        response = requests.get(f"{API_BASE_URL}/inscripciones", timeout=30)
        
        if response.status_code == 200:
            datos = response.json()
            print(f"✅ Obtenidos {len(datos)} registros")
            return datos
        else:
            print(f"❌ Error API: {response.status_code} - {response.text}")
            return []
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Error de conexión: {e}")
        return []

def formatear_datos_para_s3(datos):
    """Formatea los datos para S3 con metadatos"""
    return {
        "metadata": {
            "timestamp": datetime.now().isoformat(),
            "source": "ms-inscripciones",
            "total_records": len(datos),
            "format_version": "1.0"
        },
        "data": datos
    }

def subir_a_s3(datos_formateados):
    """Sube los datos formateados a S3"""
    try:
        s3 = boto3.client('s3', region_name=AWS_REGION)
        
        # Crear nombre de archivo con timestamp
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        s3_key = f"raw-data/inscripciones-{timestamp}.json"
        
        s3.put_object(
            Bucket=S3_BUCKET_NAME,
            Key=s3_key,
            Body=json.dumps(datos_formateados, indent=2, ensure_ascii=False),
            ContentType='application/json'
        )
        
        print(f"📤 Datos subidos a: s3://{S3_BUCKET_NAME}/{s3_key}")
        return True
        
    except Exception as e:
        print(f"❌ Error subiendo a S3: {e}")
        return False

def main():
    print("🚀 Iniciando proceso de ingesta MS Inscripciones")
    print("=" * 50)
    
    # 1. Obtener datos de la API
    datos = obtener_datos_inscripciones()
    if not datos:
        print("💥 No se pudieron obtener datos - Finalizando")
        return
    
    # 2. Formatear datos
    datos_formateados = formatear_datos_para_s3(datos)
    
    # 3. Subir a S3
    if subir_a_s3(datos_formateados):
        print("🎉 Ingesta completada exitosamente!")
        print(f"   • Registros procesados: {len(datos)}")
        print(f"   • Bucket destino: {S3_BUCKET_NAME}")
        print(f"   • Timestamp: {datetime.now().isoformat()}")
    else:
        print("💥 La ingesta falló")

if __name__ == "__main__":
    main()