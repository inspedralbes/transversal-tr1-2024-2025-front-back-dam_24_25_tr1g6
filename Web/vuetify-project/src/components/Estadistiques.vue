<template>
  <div>
    <h2>Estadísticas del Cliente</h2>
    <v-text-field
      v-model="email"
      label="Correu electrònic"
      outlined
    ></v-text-field>

    <v-btn @click="obtenerEstadisticas" :disabled="!email">
      Ver Estadísticas
    </v-btn>

    <!-- Mostrar la imagen generada solo si está disponible -->
    <div v-if="imagePath">
      <h3>Estadísticas</h3>
      <img :src="imagePath" alt="Estadísticas del cliente" />
    </div>
  </div>
</template>
  
  <script>
import { ref } from "vue"; // Importa ref para declarar las variables reactivas
import { estadisticasPython } from "../services/communicationManager"; // Ajusta la ruta de importación según tu estructura

export default {
  setup() {
    // Variables reactivas con ref
    const email = ref(""); // Variable para almacenar el correo
    const imagePath = ref(null); // Variable para almacenar la ruta de la imagen generada

    // Función para obtener las estadísticas
    const obtenerEstadisticas = async () => {
      try {
        // Llamar a la función que envía el correo al servidor
        const data = await estadisticasPython(email.value);

        // Comprobar si la respuesta contiene la ruta de la imagen
        if (data.success && data.imagePaths && data.imagePaths.length > 0) {
          // Asignar la ruta de la imagen al estado
          // Suponiendo que la ruta de la imagen se devuelve relativa al servidor
          imagePath.value = `${import.meta.env.VITE_URL_BACK}${
            data.imagePaths[0]
          }`;
        } else {
          // Manejar el caso en que no se haya generado la imagen
          console.error("No se generó la imagen de estadísticas.");
        }
      } catch (error) {
        console.error("Error al obtener las estadísticas:", error);
      }
    };

    return {
      email,
      imagePath,
      obtenerEstadisticas,
    };
  },
};
</script>
  
  <style scoped>
/* Aquí puedes agregar tus estilos */
</style>
  