<template>
  <v-app class="background">
    <!-- Contenedor principal con el contenido centrado -->
    <v-container
      class="text-center d-flex justify-center align-center"
      style="height: 100vh"
    >
      <!-- Encabezado -->
      <v-row justify="center" class="text-center">
        <v-col cols="12" class="text-center">
          <h2 class="Bienvenida">
            Benvingut a la pàgina d'administració de JuiceN'Go
          </h2>
          <h3 class="slogan">Gestiona els productes i comandes fàcilment!</h3>
        </v-col>
      </v-row>

      <!-- Botón de "Entrar" -->
      <v-row justify="center" class="mt-5">
        <v-col cols="12" sm="6">
          <v-btn
            to="/productes"
            large
            block
            @click="goToAdminPanel"
            class="entrar-btn"
          >
            Entrar a l'Administració
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
</script>

<style scoped>
.Bienvenida {
  color: #ffff;
  text-shadow: 2px 2px 4px rgb(0, 0, 0);
  font-weight: bold;
  font-size: 2.5em;
}

.slogan {
  margin-top: 10px;
  color: #ff9800;
  font-size: 2em;
  font-style: italic;
  text-shadow: 2px 2px 4px rgb(0, 0, 0);
}

.background {
  background-image: url("../assets/background-image.jpg"); /* Se ha cambiado el nombre de la imagen */
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.Logo {
  max-width: 60%;
}

.entrar-btn {
  font-weight: bold;
  background-color: #f57c00;
  color: white;
  transition: background-color 0.3s ease;
}

.entrar-btn:hover {
  background-color: #f57c00;
}

.v-btn {
  transition: transform 0.2s ease;
}

.v-btn:hover {
  transform: scale(1.05);
}

@media (max-width: 600px) {
  .Bienvenida {
    font-size: 2em;
  }

  .slogan {
    font-size: 1.2em;
  }

  .Logo {
    max-width: 80%;
  }
}
</style>
