<template>
  <v-container>
    <v-row align="center" justify="space-between">
      <v-col cols="4">
        <h2>Lista de Productos</h2>
      </v-col>
      <v-col cols="4" class="text-center">
        <v-btn
          prepend-icon="mdi-plus"
          variant="outlined"
          @click="toggleAddProductForm"
        >
          Afegir Producte
        </v-btn>
      </v-col>
      <v-col cols="4" class="text-right">
        <v-text-field
          v-model="search"
          label="Buscar Producte"
          clearable
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row v-if="showAddProductForm">
      <v-col cols="12">
        <v-card>
          <v-card-title>Afegir Nou Producte</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="callAddProduct">
              <v-text-field
                v-model="addProduct.nomProducte"
                label="Nom Producte"
                dense
                required
              ></v-text-field>
              <v-text-field
                v-model="addProduct.Descripcio"
                label="Descripcio"
                required
              ></v-text-field>
              <v-text-field
                v-model="addProduct.Preu"
                label="Preu"
                type="number"
                required
              ></v-text-field>
              <v-text-field
                v-model="addProduct.Stock"
                label="Stock"
                type="number"
                required
              ></v-text-field>
              <v-text-field
                v-model="addProduct.Imatge"
                label="Imatge URL"
                required
              ></v-text-field>
              <v-checkbox
                v-model="addProduct.Activat"
                label="Activat"
              ></v-checkbox>
              <v-btn type="submit" color="primary">Afegir</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="product in filteredProductes"
        :key="product.nomProducte"
        cols="12"
        md="4"
      >
        <v-card align="center" justify="space-between" w="100">
          <v-img :src="product.Imatge" height="200px"></v-img>
          <v-card-title>{{ product.nomProducte }}</v-card-title>
          <v-card-subtitle>{{ product.Descripcio }}</v-card-subtitle>
          <v-card-text>
            <span v-if="product.Activat === 1" class="activated">Activado</span>
            <span v-else class="blocked">Desactivado</span>
          </v-card-text>
          <v-card-text>
            <div>Price: ${{ product.Preu }}</div>
            <div>Stock: {{ product.Stock }}</div>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="editar(product)">Editar</v-btn>
            <v-btn @click="eliminar(product)">Eliminar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import {
  getProductes,
  crearProductes,
  modificarProducte,
  eliminarProducte,
} from "../services/communicationManager.js";

const productes = ref([]);
const search = ref("");
const showAddProductForm = ref(false);
const addProduct = ref({
  nomProducte: "",
  Descripcio: "",
  Preu: 0,
  Stock: 0,
  Activat: 0,
  Imatge: "",
});

const toggleAddProductForm = () => {
  showAddProductForm.value = !showAddProductForm.value;
};

const callAddProduct = async () => {
  try {
    const nouProduct = await crearProductes(addProduct.value);
    productes.value.push(nouProduct);
    addProduct.value = {
      nomProducte: "",
      Descripcio: "",
      Preu: 0,
      Stock: 0,
      Activat: 0,
      Imatge: "",
    };
    showAddProductForm.value = false;
  } catch (error) {
    console.error("Error adding product:", error);
  }
};

const filteredProductes = computed(() => {
  return productes.value.filter((product) =>
    product.nomProducte.toLowerCase().includes(search.value.toLowerCase())
  );
});

onMounted(async () => {
  try {
    productes.value = await getProductes();
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
});
</script>

<style scoped>
.v-card {
  margin-bottom: 20px;
}

.activated {
  border: 1px solid green;
  background-color: lightgreen;
  padding: 5px;
  border-radius: 5px;
}

.blocked {
  border: 1px solid red;
  background-color: lightcoral;
  padding: 5px;
  border-radius: 5px;
}
</style>