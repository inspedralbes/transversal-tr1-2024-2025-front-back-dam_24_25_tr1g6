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

    <v-row v-if="showAddProductForm" justify="center">
      <v-col cols="12" md="8" lg="6">
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
                dense
                required
              ></v-text-field>
              <v-text-field
                v-model="addProduct.Preu"
                label="Preu"
                type="number"
                dense
                required
              ></v-text-field>
              <v-text-field
                v-model="addProduct.Stock"
                label="Stock"
                type="number"
                dense
                required
              ></v-text-field>
              <v-text-field
                v-model="addProduct.Imatge"
                label="Imatge URL"
                dense
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
      <v-col cols="12">
        <v-list>
          <v-list-item
            v-for="product in filteredProductes"
            :key="product.nomProducte"
          >
            <v-list-item-content>
              <v-list-item-title>
                <span v-if="product.Stock > 0" class="stock-disponible"
                  >Stock disponible {{ product.Stock }}</span
                >
                <span v-else class="stock-no-disponible">Sin stock</span>
              </v-list-item-title>
              <v-list-item-subtitle>
                <span v-if="product.Activat === 1" class="activated"
                  >Activado</span
                >
                <span v-else class="blocked">Desactivado</span>
              </v-list-item-subtitle>
              <v-list-item-subtitle
                >Nom: {{ product.nomProducte }}</v-list-item-subtitle
              >
              <v-list-item-subtitle
                >Descripcio: {{ product.Descripcio }}</v-list-item-subtitle
              >
              <v-list-item-subtitle
                >Preu: ${{ product.Preu }}</v-list-item-subtitle
              >
            </v-list-item-content>
            <v-list-item-avatar>
              <v-img :src="product.Imatge" height="50" width="50"></v-img>
            </v-list-item-avatar>
            <v-list-item-action>
              <v-btn @click="editar(product)">Editar</v-btn>
              <v-btn @click="eliminar(product)">Eliminar</v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
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
    console.log("productes", productes);
  } catch (error) {
    console.error("Error adding product:", error);
  }
};

const filteredProductes = computed(() => {
  const filtered = productes.value
    .filter((product) => product && product.nomProducte)
    .filter((product) =>
      product.nomProducte.toLowerCase().includes(search.value.toLowerCase())
    );

  return filtered;
});

onMounted(async () => {
  try {
    const response = await getProductes();
    if (Array.isArray(response)) {
      productes.value = response;
    } else {
      console.error("El JSON de productos no es un array");
    }
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