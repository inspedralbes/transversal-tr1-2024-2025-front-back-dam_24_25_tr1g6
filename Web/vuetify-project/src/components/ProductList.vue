<template>
  <v-container>
    <v-row>
      <v-col
        v-for="product in productes"
        :key="product.nomProducte"
        cols="12"
        md="4"
      >
        <v-card>
          <v-img :src="product.Imatge" height="200px"></v-img>
          <v-card-title>{{ product.nomProducte }}</v-card-title>
          <v-card-subtitle>{{ product.Descripcio }}</v-card-subtitle>
          <v-card-text>
            <div>Price: ${{ product.Preu }}</div>
            <div>Stock: {{ product.Stock }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, onMounted } from "vue";
import productData from "@/assets/productes.json";

export default {
  name: "ProductList",
  setup() {
    const productes = ref([]);

    onMounted(() => {
      productes.value = productData.productes;
    });

    return {
      productes,
    };
  },
};
</script>

<style scoped>
.v-card {
  margin-bottom: 20px;
}
</style>