import requests
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import os # No eliminar

# Definir la URL base de l'API
# API_URL = "http://localhost:3010/statistics-client"
API_URL = "http://juicengo.dam.inspedralbes.cat:20871/statistics-client"

# Funció per obtenir les comandes (vendes) d'un client basant-se en el seu correu
def obtenir_comandes_per_correu(correu):
    try:
        # Realitzar la sol·licitud GET amb el correu com a paràmetre
        response = requests.get(API_URL, params={'Correu': correu})
        
        # Comprovar si la sol·licitud ha estat exitosa
        if response.status_code != 200:
            print(f"Error al obtenir les comandes: {response.text}")
            return None
        
        # Convertir la resposta JSON a un DataFrame
        data = response.json()
        
        # Comprovar si s'han rebut dades
        if 'message' in data:
            print(f"Error: {data['message']}")
            return None

        # Convertir les dades de les comandes a un DataFrame
        df_comandes = pd.DataFrame(data)
        
        # Comprovar si el DataFrame no està buit
        if df_comandes.empty:
            print("No es va trobar comandes d'aquest client.")
            return None

        return df_comandes

    except requests.exceptions.RequestException as e:
        # Capturar errors relacionats amb la connexió
        print(f"Error en la connexió amb l'API: {e}")
        return None
    except Exception as e:
        # Capturar qualsevol altre error
        print(f"S'ha produït un error inesperat: {e}")
        return None

# Funció per crear el gràfic de barres de l'historial de vendes d'un client
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
        
        # Crear el gràfic de barres
        plt.figure(figsize=(10, 6))  # Ajustar la mida del gràfic
        bars = plt.bar(x_positions, preu_total, color='lightblue', width=0.6, align='center')

        # Etiquetes i títol
        plt.xlabel("Data")
        plt.ylabel("Preu Total (€)")
        plt.title("Historial de Vendes del Client")
        
        # Afegir etiquetes de valors a sobre de cada barra
        for bar in bars:
            plt.text(bar.get_x() + bar.get_width() / 2, bar.get_height(),
                     f'{bar.get_height():.2f}', ha='center', va='bottom', fontsize=9)

        # Configurar les etiquetes de l'eix X per mostrar les dates
        plt.xticks(x_positions, df_comandes['data'].dt.strftime('%Y-%m-%d'), rotation=45, ha="right", fontsize=10)
        
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
        # if not os.path.exists('Grafiques'):
        #    os.makedirs('Grafiques')

        # Guardar el gràfic com a imatge a la carpeta 'Grafiques'
        # plt.savefig('Grafiques/historial_vendes_del_client.png')  # Nom de la imatge

        # Mostrar el gràfic
        plt.show()

    except Exception as e:
        # Capturar errors al crear el gràfic
        print(f"S'ha produït un error en crear el gràfic: {e}")

# Sol·licitar al usuari el correu del client
correu_cliente = input("Introdueix el correu del client: ")

# Obtenir les comandes del client
df_comandes = obtenir_comandes_per_correu(correu_cliente)

# Si s'han obtingut comandes, crear el gràfic
if df_comandes is not None:
    crear_grafic_historial_vendes(df_comandes)
