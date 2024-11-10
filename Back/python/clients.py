import requests
import pandas as pd
from PIL import Image, ImageDraw, ImageFont
import os # No eliminar

# Definir la URL base de l'API
# API_URL = "http://localhost:3010/statistics-clients"
API_URL = "http://juicengo.dam.inspedralbes.cat:20871/estadistiques-clients"

def obtenir_dades_estadistiques():
    """
    Obté les dades estadístiques de l'API i les retorna com a un DataFrame.
    """
    try:
        # Intentar obtenir les dades de l'API
        response = requests.get(API_URL)
        
        # Verificar si la resposta és correcta
        if response.status_code != 200:
            print(f"Error: La connexió amb l'API ha fallat (Codi d'estat: {response.status_code})")
            return None
        
        # Obtenir les dades en format JSON
        data = response.json()

        # Comprovar si la resposta de l'API conté un missatge d'error
        if 'message' in data:
            print("Error en obtenir les dades:", data['message'])
            return None
        else:
            # Procesar les dades en un DataFrame de Pandas
            df = pd.DataFrame(data)
            df['Diners/venda'] = pd.to_numeric(df['Diners/venda'], errors='coerce')
            df = df.dropna(subset=['Diners/venda']).round(2)
            df['Moneda'] = '€'

            print("\nDades de vendes per client amb Moneda:")
            print(df.to_string(index=False))
            
            return df

    except requests.exceptions.RequestException as e:
        # Capturar errors relacionats amb la connexió a l'API
        print(f"Error en la connexió a l'API: {e}")
        return None
    except Exception as e:
        # Capturar qualsevol altre tipus d'error
        print(f"S'ha produït un error inesperat: {e}")
        return None

def crear_imatge_dades_vendes(df_promedio):
    """
    Crea una imatge amb les dades de vendes dels clients.
    """
    try:
        # Configurar la capçalera i les files de dades
        capçalera = "Dades de vendes per client amb Moneda:\n"
        columnes = "ID   Clients   Vendes    Diners    Diners/venda    Moneda\n"
        files = [
            f"{int(row['ID']):<5} {row['Clients']:<13} {int(row['Ventes']):<10} {float(row['Diners']):<15} {float(row['Diners/venda']):<23} {row['Moneda']}"
            for _, row in df_promedio.iterrows()
        ]
        
        # Crear el text complet que es dibuixarà
        text_complet = capçalera + columnes + "\n".join(files)

        # Ajustar la mida de la imatge segons la quantitat de dades
        amplada, altura = 500, 100 + 20 * len(files)
        imatge = Image.new('RGB', (amplada, altura), color='white')
        dibuixar = ImageDraw.Draw(imatge)
        
        # Fer servir una font bàsica
        try:
            font = ImageFont.truetype("arial.ttf", 18)
        except IOError:
            font = ImageFont.load_default()

        # Dibuixar el text a la imatge
        dibuixar.text((10, 10), text_complet, font=font, fill='black')

        # Crear la carpeta 'Grafiques' si no existeix
        if not os.path.exists('grafiques'):
           os.makedirs('grafiques')
        
        # Guardar la imatge
        imatge.save('grafiques/dades_vendes_clients.png')
        print("Imatge guardada correctament a 'grafiques/dades_vendes_clients.png'")

    except Exception as e:
        # Capturar qualsevol error en la creació de la imatge
        print(f"S'ha produït un error en crear la imatge: {e}")

# Obtenir les dades de vendes des de l'API
df_promedio = obtenir_dades_estadistiques()

# Si s'han obtingut dades, crear la imatge
if df_promedio is not None:
    crear_imatge_dades_vendes(df_promedio)
