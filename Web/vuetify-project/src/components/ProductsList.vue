<template>
  <v-app class="background">
    <v-container>
      <v-row align="center" justify="space-between">
        <v-col cols="4">
          <h2 class="tit">Llista de Productes</h2>
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
            label="Buscar"
            variant="filled"
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
                      v-model="nomProducte"
                      label="Nom Producte"
                      prepend-icon="mdi-tag"
                      dense
                      outlined
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="Descripcio"
                      label="Descripcio"
                      prepend-icon="mdi-text"
                      dense
                      outlined
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="Preu"
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
                      v-model="Stock"
                      label="Stock"
                      prepend-icon="mdi-package-variant"
                      type="number"
                      dense
                      outlined
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-file-input
                      label="Imatge"
                      chips
                      accept="image/*"
                    ></v-file-input>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-checkbox
                      v-model="Activat"
                      :value="1"
                      label="Activar"
                      dense
                      @change="Activat = 1"
                    ></v-checkbox>
                    <v-checkbox
                      v-model="Activat"
                      :value="0"
                      label="Desactivar"
                      dense
                      @change="Activat = 0"
                    ></v-checkbox>
                  </v-col>
                </v-row>
                <v-btn type="submit" id="botoAfegir" class="mt-4">Afegir</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-list class="product-list-item">
            <v-list-item
              v-for="product in filteredProductes"
              :key="product.nomProducte"
              class="product-list-item"
            >
              <v-row align="center">
                <v-col cols="1">
                  <v-list-item-avatar>
                    <v-img
                      :src="`http://juicengo.dam.inspedralbes.cat:20871/uploads/images/${product.Imatge}`"
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
                    <v-card-title class="headline"
                      >Editar Producte</v-card-title
                    >
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
                            <v-img
                              v-if="editingProduct.Imatge && !newImage"
                              :src="editingProduct.Imatge"
                              max-height="150"
                              max-width="150"
                              class="mb-4"
                            ></v-img>
                            <v-file-input
                              label="Seleccionar nueva imagen"
                              accept="image/*"
                              v-model="newImage"
                              prepend-icon="mdi-image"
                              dense
                              outlined
                              @change="handleImageChange"
                            ></v-file-input>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-checkbox
                              v-model="editingProduct.Activat"
                              :true-value="1"
                              :false-value="0"
                              label="Activar"
                              dense
                              @change="
                                editingProduct.Activat = 1;
                                if (editingProduct.Activat === 0)
                                  editingProduct.Activat = 1;
                              "
                            ></v-checkbox>
                            <v-checkbox
                              v-model="editingProduct.Activat"
                              :true-value="0"
                              :false-value="1"
                              label="Desactivar"
                              dense
                              @change="
                                editingProduct.Activat = 0;
                                if (editingProduct.Activat === 1)
                                  editingProduct.Activat = 0;
                              "
                            ></v-checkbox>
                          </v-col>
                        </v-row>
                        <v-btn type="submit" class="guardar">Guardar</v-btn>
                        <v-btn @click="cancelEdit" class="cancelar"
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
  </v-app>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import {
  getProductes,
  crearProductes,
  modificarProducte,
  eliminarProducte,
} from "../services/communicationManager.js";

const nomProducte = ref("");
const Descripcio = ref("");
const Preu = ref(0);
const Stock = ref(0);
const Activat = ref(0);

const productes = ref([]);
const newImage = ref(null);
const search = ref("");
const showAddProductForm = ref(false);

const editingProduct = ref(null);
const loading = ref(false);

const toggleAddProductForm = () => {
  showAddProductForm.value = !showAddProductForm.value;
};

const callAddProduct = async () => {
  loading.value = true;
  if (
    nomProducte.value == null ||
    Descripcio.value == null ||
    Preu.value == null ||
    Stock.value == null ||
    Activat.value == null
  ) {
    alert("Falten camps per omplir");
    return;
  } else {
    const formData = {
      nomProducte: nomProducte.value,
      Descripcio: Descripcio.value,
      Preu: Preu.value,
      Stock: Stock.value,
      Activat: Activat.value,
    };

    const imageInput = document.querySelector("input[type='file']");
    await crearProductes(formData, imageInput.files[0]);

    showAddProductForm.value = false;

    const response = await getProductes();
    if (Array.isArray(response.productes)) {
      productes.value = response.productes;
    } else {
      console.error("El JSON de productos no es un array");
    }
  }
};

const callEditProduct = async () => {
  loading.value = true;

  if (
    editingProduct.value.nomProducte == null ||
    editingProduct.value.Descripcio == null ||
    editingProduct.value.Preu == null ||
    editingProduct.value.Stock == null ||
    editingProduct.value.Activat == null
  ) {
    alert("Falten camps per omplir");
    loading.value = false;
    return;
  }

  const formData = {
    idProducte: editingProduct.value.idProducte,
    nomProducte: editingProduct.value.nomProducte,
    Descripcio: editingProduct.value.Descripcio,
    Preu: editingProduct.value.Preu,
    Stock: editingProduct.value.Stock,
    Activat: editingProduct.value.Activat,
  };

  const imageFile = newImage.value ? newImage.value : null;

  try {
    const updatedProduct = await modificarProducte(formData, imageFile);

    const index = productes.value.findIndex(
      (p) => p.idProducte === updatedProduct.idProducte
    );

    if (index !== -1) {
      productes.value[index] = {
        ...updatedProduct,
        Activat: updatedProduct.Activat,
      };
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

  const response = await getProductes();
  if (Array.isArray(response.productes)) {
    productes.value = response.productes;
  } else {
    console.error("El JSON de productos no es un array");
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
  background-color: rgb(255, 234, 167);
}

.edit-product-card {
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  background-color: rgb(255, 234, 167);
}

.headline {
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.activated {
  background-color: rgb(220, 255, 183);
  padding: 5px;
  border-radius: 10px;
}

.blocked {
  background-color: rgb(255, 104, 104);
  padding: 5px;
  border-radius: 10px;
}

.stock-disponible {
  color: rgb(220, 255, 183);
  text-shadow: 1px 1px 2px rgb(0, 0, 0);
}

.stock-no-disponible {
  color: rgb(255, 104, 104);
  text-shadow: 1px 1px 2px rgb(0, 0, 0);
}

.product-list-item {
  background-color: rgb(255, 251, 230);
  padding: 5px;
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
.background {
  background-color: rgb(255, 251, 230);
}
#botoAfegir {
  background-color: rgb(220, 255, 183);
}
.tit {
  color: rgb(255, 187, 100);
  text-shadow: 1px 1px 2px rgb(0, 0, 0);
}
.guardar {
  background-color: rgb(220, 255, 183);
}
.cancelar {
  background-color: rgb(255, 104, 104);
}
</style>
