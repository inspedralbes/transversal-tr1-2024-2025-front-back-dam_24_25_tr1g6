<template>
  <v-container>
    <v-row align="center" justify="space-between">
      <v-col cols="4">
        <h2>Llista de Productes</h2>
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
          :loading="loading"
          v-model="search"
          append-inner-icon="mdi-magnify"
          density="compact"
          label="Search templates"
          variant="solo"
          hide-details
          single-line
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row v-if="showAddProductForm" justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="add-product-card">
          <v-card-title class="headline">Afegir Nou Producte</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="callAddProduct">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="addProduct.nomProducte"
                    label="Nom Producte"
                    prepend-icon="mdi-tag"
                    dense
                    outlined
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="addProduct.Descripcio"
                    label="Descripcio"
                    prepend-icon="mdi-text"
                    dense
                    outlined
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="addProduct.Preu"
                    label="Preu"
                    prepend-icon="mdi-currency-usd"
                    type="number"
                    dense
                    outlined
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="addProduct.Stock"
                    label="Stock"
                    prepend-icon="mdi-package-variant"
                    type="number"
                    dense
                    outlined
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="addProduct.Imatge"
                    label="Imatge URL"
                    prepend-icon="mdi-image"
                    dense
                    outlined
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-checkbox
                    v-model="addProduct.Activat"
                    :value="1"
                    label="Activar"
                    dense
                    @change="addProduct.Activat = 1"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="addProduct.Activat"
                    :value="0"
                    label="Desactivar"
                    dense
                    @change="addProduct.Activat = 0"
                  ></v-checkbox>
                </v-col>
              </v-row>
              <v-btn type="submit" color="primary" class="mt-4">Afegir</v-btn>
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
            class="product-list-item"
          >
            <v-row align="center">
              <v-col cols="1">
                <v-list-item-avatar>
                  <v-img
                    :src="product.Imatge"
                    height="50"
                    width="50"
                    rounded="lg"
                  ></v-img>
                </v-list-item-avatar>
              </v-col>
              <v-col cols="2">
                <v-list-item-title>
                  <span v-if="product.Stock > 0" class="stock-disponible"
                    >Stock disponible {{ product.Stock }}</span
                  >
                  <span v-else class="stock-no-disponible">Sin stock</span>
                </v-list-item-title>
              </v-col>
              <v-col cols="2">
                <v-list-item-subtitle>
                  <span v-if="product.Activat === 1" class="activated"
                    >Activado</span
                  >
                  <span v-else class="blocked">Desactivado</span>
                </v-list-item-subtitle>
              </v-col>
              <v-col cols="2">
                <v-list-item-subtitle>
                  {{ product.nomProducte }}
                </v-list-item-subtitle>
              </v-col>
              <v-col cols="3">
                <v-list-item-subtitle>
                  {{ product.Descripcio }}
                </v-list-item-subtitle>
              </v-col>
              <v-col cols="1">
                <v-list-item-subtitle>
                  {{ product.Preu }} €
                </v-list-item-subtitle>
              </v-col>
              <v-col cols="1">
                <v-list-item-action>
                  <v-btn @click="editar(product)" icon color="primary">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    @click="callDeleteProduct(product.idProducte)"
                    icon
                    color="red"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-col>
            </v-row>
            <v-row
              v-if="
                editingProduct &&
                editingProduct.idProducte === product.idProducte
              "
            >
              <v-col cols="12">
                <v-card class="edit-product-card">
                  <v-card-title class="headline">Editar Producte</v-card-title>
                  <v-card-text>
                    <v-form @submit.prevent="callEditProduct">
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="editingProduct.nomProducte"
                            label="Nom Producte"
                            prepend-icon="mdi-tag"
                            dense
                            outlined
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="editingProduct.Descripcio"
                            label="Descripcio"
                            prepend-icon="mdi-text"
                            dense
                            outlined
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="editingProduct.Preu"
                            label="Preu"
                            prepend-icon="mdi-currency-usd"
                            type="number"
                            dense
                            outlined
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="editingProduct.Stock"
                            label="Stock"
                            prepend-icon="mdi-package-variant"
                            type="number"
                            dense
                            outlined
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="editingProduct.Imatge"
                            label="Imatge URL"
                            prepend-icon="mdi-image"
                            dense
                            outlined
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-checkbox
                            v-model="editingProduct.Activat"
                            :value="1"
                            label="Activar"
                            dense
                            @change="editingProduct.Activat = 1"
                          ></v-checkbox>
                          <v-checkbox
                            v-model="editingProduct.Activat"
                            :value="0"
                            label="Desactivar"
                            dense
                            @change="editingProduct.Activat = 0"
                          ></v-checkbox>
                        </v-col>
                      </v-row>
                      <v-btn type="submit" color="primary" class="mt-4"
                        >Guardar</v-btn
                      >
                      <v-btn @click="cancelEdit" color="secondary" class="mt-4"
                        >Cancelar</v-btn
                      >
                    </v-form>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
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
const editingProduct = ref(null);
const loading = ref(false);

const toggleAddProductForm = () => {
  showAddProductForm.value = !showAddProductForm.value;
};

const callAddProduct = async () => {
  try {
    loading.value = true;
    const nouProduct = await crearProductes(addProduct.value);
    if (nouProduct && nouProduct.producte) {
      productes.value.push(nouProduct.producte);
    }
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
  } finally {
    loading.value = false;
  }
};

const callEditProduct = async () => {
  try {
    const updatedProduct = await modificarProducte(editingProduct.value);
    if (!updatedProduct || !updatedProduct.idProducte) {
      throw new Error("Error updating product");
    }

    const index = productes.value.findIndex(
      (p) => p.idProducte === updatedProduct.idProducte
    );

    if (index !== -1) {
      productes.value[index] = updatedProduct;
    }
    editingProduct.value = null;
  } catch (error) {
    console.error("Error updating product:", error);
  }
};

const callDeleteProduct = async (idProducte) => {
  try {
    const response = await eliminarProducte(idProducte);
    console.log("vue response", idProducte, response);
    if (response && response.idProducte) {
      productes.value = productes.value.filter(
        (p) => p.idProducte !== response.idProducte
      );
    }
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};

const cancelEdit = () => {
  editingProduct.value = null;
};

const editar = (product) => {
  editingProduct.value = { ...product };
};

const filteredProductes = computed(() => {
  if (Array.isArray(productes.value)) {
    return productes.value
      .filter((product) => product && product.nomProducte)
      .filter((product) =>
        product.nomProducte.toLowerCase().includes(search.value.toLowerCase())
      );
  } else {
    return [];
  }
});

onMounted(async () => {
  try {
    const response = await getProductes();
    if (Array.isArray(response.productes)) {
      productes.value = response.productes;
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

.add-product-card {
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.edit-product-card {
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.headline {
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.activated {
  background-color: lightgreen;
  padding: 5px;
  border-radius: 10px;
}

.blocked {
  background-color: lightcoral;
  padding: 5px;
  border-radius: 10px;
}

.stock-disponible {
  color: green;
}

.stock-no-disponible {
  color: red;
}

.product-list-item {
  border-bottom: 1px solid #e0e0e0;
  padding: 10px 0;
}

.v-list-item-avatar {
  margin-right: 10px;
}

.v-list-item-title,
.v-list-item-subtitle {
  margin: 0;
}

.v-list-item-action {
  display: flex;
  justify-content: flex-end;
}

.v-btn {
  margin-left: 5px;
}
</style>