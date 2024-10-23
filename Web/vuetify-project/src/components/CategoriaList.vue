<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-toolbar color="primary" dark>
          <v-toolbar-title>Categories de Productes</v-toolbar-title>
        </v-toolbar>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="categoria in categories" :key="categoria.id" cols="12" md="4">
        <v-card>
          <v-img :src="categoria.imatge" height="200px" alt="imatge_categoria"></v-img>
          <v-card-title>{{ categoria.nom }}</v-card-title>
          <v-card-text>
            {{ categoria.descripcio }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { ref } from "vue";
  // import { getCategories } from "../services/communicationManager.js";


  // eslint-disable-next-line no-undef
  categories = ref([
        { id: 1, nom: 'Sucs de Fruita', descripcio: 'Sucs fets de fruites fresques.', imatge: 'https://i.sstatic.net/y9DpT.jpg' },
        { id: 2, nom: 'Batuts', descripcio: 'Batuts naturals i energètics.', imatge: 'https://i.sstatic.net/y9DpT.jpg' },
        { id: 3, nom: 'Smoothies', descripcio: 'Smoothies amb ingredients saludables.', imatge: 'https://i.sstatic.net/y9DpT.jpg' }
  ]);

  /*onMounted(async () => {
    try {
      categories.value = await getCategories();
    } catch (error) {
      console.error("Error fetching JSON");
    }
  });*/

</script>

<style scoped>
.v-card {
  margin-bottom: 20px;
}
</style>
