<template>
  <div class="container-principal">
    <div class="container-left">
      <h2>Estadistiques d'un Client</h2>
      <v-text-field
        v-model="email"
        label="Correu electrònic"
        outlined
        class="input-field"
      ></v-text-field>

      <v-btn @click="obtenerEstadisticas" :disabled="!email" class="action-btn">
        Veure Estadistiques
      </v-btn>

      <!-- Mostrar el indicador de carga si está cargando -->
      <div v-if="loading" class="loading-indicator">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
        <p>Generant estadistica...</p>
      </div>

      <!-- Mostrar la imagen generada solo si está disponible -->
      <div v-if="imagePaths && !loading" class="image-container">
        <img :src="imagePaths" alt="Estadísticas del cliente" />
      </div>
    </div>
    <div class="container-right">
      <h2>Estadistiques generals dels Clients</h2>

      <v-btn @click="obtenerEstadisticasClientes" class="action-btn">
        Veure Estadistiques
      </v-btn>

      <!-- Mostrar el indicador de carga si está cargando -->
      <div v-if="loadingClientes" class="loading-indicator">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
        <p>Generant estadistica...</p>
      </div>

      <!-- Mostrar la imagen generada solo si está disponible -->
      <div v-if="imagePathsClients && !loadingClientes" class="image-container">
        <img :src="imagePathsClients" alt="Estadísticas del cliente" />
      </div>
    </div>
  </div>
</template>
  
<script>
import { ref } from "vue"; // Importa ref para declarar las variables reactivas
import {
  estadisticasPythonUnClient,
  getEstadisticasPythonClients,
} from "../services/communicationManager"; // Ajusta la ruta de importación según tu estructura

export default {
  setup() {
    // Variables reactivas con ref
    const email = ref(""); // Variable para almacenar el correo
    const imagePaths = ref(null); // Variable para almacenar la ruta de la imagen generada
    const imagePathsClients = ref(null);
    const loading = ref(false); // Variable para controlar el estado de carga
    const loadingClientes = ref(false);

    // Función para obtener las estadísticas del cliente
    const obtenerEstadisticas = async () => {
      loading.value = true; // Iniciar el estado de carga
      try {
        // Llamar a la función que envía el correo al servidor
        const data = await estadisticasPythonUnClient(email.value);

        // Simular un tiempo de espera de 5 segundos
        setTimeout(() => {
          // Comprobar si la respuesta contiene la ruta de la imagen
          if (data.success && data.imagePaths && data.imagePaths.length > 0) {
            // Asignar la ruta de la imagen al estado
            // Suponiendo que la ruta de la imagen se devuelve relativa al servidor
            imagePaths.value =
              `${import.meta.env.VITE_URL_BACK}/` + `${data.imagePaths[0]}`;
            console.log(imagePaths.value);
          } else {
            // Manejar el caso en que no se haya generado la imagen
            console.error("No se generó la imagen de estadísticas.");
          }
          loading.value = false; // Finalizar el estado de carga
        }, 5000); // Esperar 5 segundos
      } catch (error) {
        console.error("Error al obtener las estadísticas:", error);
        loading.value = false; // Finalizar el estado de carga en caso de error
      }
    };

    // Función para obtener las estadísticas de todos los clientes
    const obtenerEstadisticasClientes = async () => {
      loadingClientes.value = true;
      try {
        // Llamar a la función que obtiene las estadísticas de todos los clientes
        const data = await getEstadisticasPythonClients();

        // Simular un tiempo de espera de 5 segundos
        setTimeout(() => {
          // Comprobar si la respuesta contiene la ruta de la imagen
          if (
            data.success &&
            data.imagePathsClients &&
            data.imagePathsClients.length > 0
          ) {
            // Asignar la ruta de la imagen al estado
            // Suponiendo que la ruta de la imagen se devuelve relativa al servidor
            imagePathsClients.value =
              `${import.meta.env.VITE_URL_BACK}/` +
              `grafiques/dades_vendes_clients.png`;
            console.log(imagePathsClients.value);
          } else {
            // Manejar el caso en que no se haya generado la imagen
            console.error("No se generó la imagen de estadísticas.");
          }
          loadingClientes.value = false; // Finalizar el estado de carga
        }, 5000); // Esperar 5 segundos
      } catch (error) {
        console.error("Error al obtener las estadísticas:", error);
        loadingClientes.value = false; // Finalizar el estado de carga en caso de error
      }
    };

    obtenerEstadisticasClientes();

    return {
      email,
      imagePaths,
      imagePathsClients,
      loading,
      loadingClientes,
      obtenerEstadisticas,
      obtenerEstadisticasClientes,
    };
  },
};
</script>
  
<style scoped>
.container-principal {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 50px;
  width: 100%;
}
.container-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.input-field {
  width: 300px; /* Ajusta el tamaño del input */
  margin-bottom: 20px;
}

.action-btn {
  margin-bottom: 20px;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-container img {
  max-width: 800px; /* Ajusta el tamaño de la imagen */
  width: 100%; /* Mantener la imagen responsiva */
  margin-top: 20px;
}
</style>