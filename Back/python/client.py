import sys
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import os  # No eliminar
import json

# Funció per crear el gràfic de barres de l'historial de vendes d'un client amb estils millorats
def crear_grafic_historial_vendes(df_comandes):
    try:
        # Assegurar-se que la columna 'PreuTotal' és numèrica
        df_comandes['PreuTotal'] = pd.to_numeric(df_comandes['PreuTotal'], errors='coerce')
        
        # Eliminar files amb valors NaN en 'PreuTotal'
        df_comandes = df_comandes.dropna(subset=['PreuTotal'])
        
        # Convertir 'PreuTotal' en un array de numpy per un tractament més ràpid
        preu_total = np.array(df_comandes['PreuTotal'])
        
        # Calcular algunes estadístiques per als preus totals (mitjana, màxim, mínim)
        mitjana_preu = np.mean(preu_total)
        max_preu = np.max(preu_total)
        min_preu = np.min(preu_total)
        
        # Assegurar-se que les dates estiguin en format datetime (utilitzant la columna 'data')
        df_comandes['data'] = pd.to_datetime(df_comandes['data'])
        
        # Crear les posicions de les barres basades en les dates
        x_positions = np.arange(len(df_comandes))
        
        # Crear el gràfic de barres amb estil de fons i colors personalitzats
        plt.figure(figsize=(12, 7))  # Ajustar la mida del gràfic
        plt.gca().set_facecolor('whitesmoke')  # Color de fons del gràfic
        
        # Crear les barres amb colors alterns
        colors = ['skyblue' if i % 2 == 0 else 'lightcoral' for i in range(len(preu_total))]
        bars = plt.bar(x_positions, preu_total, color=colors, width=0.6, align='center', edgecolor='black')

        # Etiquetes i títol amb estils millorats
        plt.xlabel("Data", fontsize=12, fontweight='bold')
        plt.ylabel("Preu Total (€)", fontsize=12, fontweight='bold')
        plt.title("Historial de Vendes del Client", fontsize=14, fontweight='bold', color='navy')
        
        # Afegir etiquetes de valors a sobre de cada barra
        for bar in bars:
            plt.text(bar.get_x() + bar.get_width() / 2, bar.get_height(),
                     f'{bar.get_height():.2f}', ha='center', va='bottom', fontsize=10, color='black')

        # Configurar les etiquetes de l'eix X per mostrar les dates
        plt.xticks(x_positions, df_comandes['data'].dt.strftime('%Y-%m-%d'), rotation=45, ha="right", fontsize=10)

        # Afegir línies de quadrícula estilitzades
        plt.grid(axis='y', linestyle='--', linewidth=0.5, color='gray', alpha=0.7)

        # Afegir les estadístiques a la imatge, a l'esquerra
        stats_text = (f"Estadístiques de les vendes del client:\n"
                      f"Mitjana del preu total: {mitjana_preu:.2f} €\n"
                      f"Preu màxim: {max_preu:.2f} €\n"
                      f"Preu mínim: {min_preu:.2f} €")
        
        # Afegir el text de les estadístiques a la part esquerra de la imatge
        plt.text(1.02, 0.98, stats_text, transform=plt.gca().transAxes, fontsize=10, verticalalignment='top', 
                 bbox=dict(facecolor='white', alpha=0.7, edgecolor='black', boxstyle='round,pad=0.5'))

        # Ajustar el disseny perquè no es tallin les etiquetes
        plt.tight_layout()

        # Crear la carpeta 'Grafiques' si no existeix
        if not os.path.exists('grafiques'):
            os.makedirs('grafiques')

        # Guardar el gràfic com a imatge a la carpeta 'Grafiques'
        output_path = 'grafiques/historial_vendes_del_client.png'
        plt.savefig(output_path, bbox_inches='tight')  # Nom de la imatge

        # Mostrar el gràfic (opcional)
        # plt.show()

        # Retornar la ruta de la imatge
        return output_path

    except Exception as e:
        # Capturar errors al crear el gràfic
        print(f"S'ha produït un error en crear el gràfic: {e}")
        return None

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
df_comandes = pd.DataFrame(data)

# Si s'han obtingut comandes, crear el gràfic
if not df_comandes.empty:
    output_path = crear_grafic_historial_vendes(df_comandes)
    if output_path:
        print(output_path)
