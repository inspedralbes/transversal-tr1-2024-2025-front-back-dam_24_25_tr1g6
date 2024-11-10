import sys
import pandas as pd
from PIL import Image, ImageDraw, ImageFont
import os  # No eliminar
import json

def crear_imatge_dades_vendes(df_promedio):
    """
    Crea una imatge amb les dades de vendes dels clients amb estils millorats.
    """
    try:
        # Verificar que las columnas necesarias están presentes
        required_columns = ['ID', 'Clients', 'Ventes', 'Diners', 'Diners/venda', 'Moneda']
        for col in required_columns:
            if col not in df_promedio.columns:
                raise ValueError(f"Falta la columna requerida: {col}")

        # Configurar la capçalera i les files de dades
        capçalera = "Dades de vendes per client amb Moneda:\n"
        columnes = "ID   Clients   Ventes    Diners    Diners/venda    Moneda\n"
        files = [
            f"{int(row['ID']):<5} {row['Clients']:<13} {int(row['Ventes']):<10} {float(row['Diners']):<15} {float(row['Diners/venda']):<23} {row['Moneda']}"
            for _, row in df_promedio.iterrows()
        ]

        # Crear el text complet que es dibuixarà
        text_complet = capçalera + columnes + "\n".join(files)

        # Ajustar la mida de la imatge segons la quantitat de dades
        amplada, altura = 600, 100 + 30 * len(files)
        imatge = Image.new('RGB', (amplada, altura), color='white')
        dibuixar = ImageDraw.Draw(imatge)

        # Fer servir una font bàsica
        try:
            font = ImageFont.truetype("arial.ttf", 18)
            header_font = ImageFont.truetype("arial.ttf", 22)
        except IOError:
            font = ImageFont.load_default()
            header_font = font

        # Dibuixar la capçalera amb un estil diferent
        dibuixar.rectangle([(0, 0), (amplada, 50)], fill='lightblue')
        dibuixar.text((10, 10), capçalera.strip(), font=header_font, fill='black')

        # Dibuixar les columnes amb un fons diferent
        dibuixar.rectangle([(0, 50), (amplada, 80)], fill='lightgray')
        dibuixar.text((10, 55), columnes.strip(), font=font, fill='black')

        # Dibuixar les files de dades amb colors alterns
        y_offset = 80
        for i, fila in enumerate(files):
            if i % 2 == 0:
                dibuixar.rectangle([(0, y_offset), (amplada, y_offset + 30)], fill='whitesmoke')
            dibuixar.text((10, y_offset + 5), fila, font=font, fill='black')
            y_offset += 30

        # Crear la carpeta 'Grafiques' si no existeix
        if not os.path.exists('grafiques'):
            os.makedirs('grafiques')

        # Guardar la imatge
        output_path = 'grafiques/dades_vendes_clients.png'
        imatge.save(output_path)
        print(output_path)

    except Exception as e:
        # Capturar qualsevol error en la creació de la imatge
        print(f"S'ha produït un error en crear la imatge: {e}")

# Comprovar que s'ha passat l'argument del fitxer temporal
if len(sys.argv) < 2:
    print("Error: Falta l'argument del fitxer temporal")
    sys.exit(1)

# Obtenir la ruta del fitxer temporal del primer argument
temp_file_path = sys.argv[1]

# Llegir les dades del fitxer temporal
with open(temp_file_path, 'r') as file:
    data = json.load(file)

# Convertir les dades de les comandes a un DataFrame
df_promedio = pd.DataFrame(data)

# Afegir la columna 'Moneda' amb un valor per defecte si no està present
if 'Moneda' not in df_promedio.columns:
    df_promedio['Moneda'] = 'EUR'  # O qualsevol valor per defecte que necessitis

# Si s'han obtingut dades, crear la imatge
if not df_promedio.empty:
    crear_imatge_dades_vendes(df_promedio)

print("Columnes del DataFrame:", df_promedio.columns)
