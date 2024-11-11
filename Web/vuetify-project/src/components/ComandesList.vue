<template>
  <v-app class="background">
    <v-container>
      <v-row>
        <v-col cols="6" class="text-left">
          <v-text-field
            :loading="loading"
            v-model="search"
            append-inner-icon="mdi-magnify"
            density="compact"
            label="Buscar Comanda per ID"
            variant="filled"
            hide-details
            single-line
          ></v-text-field>
        </v-col>
        <v-col cols="6" class="text-right">
          <v-select
            solo
            background-color="primary"
            v-model="statusFilter"
            :items="[
              'PENDENT_DE_PREPARACIO',
              'EN_PREPARACIO',
              'PREPARAT_PER_RECOLLIR',
              'RECOLLIT',
            ]"
            label="Filtrar per Estat"
            prepend-icon="mdi-filter"
            dense
            outlined
          >
          </v-select>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title class="asd">
              <h2 class="tit">Comandes</h2>
            </v-card-title>
            <v-card-text class="asd">
              <v-data-table
                :headers="headers"
                :items="filteredComandes"
                :loading="loading"
                loading-text="Buscant informació"
                class="elevation-1"
                no-data-text="No hi ha comandes disponibles"
                hide-default-footer
                id="asd"
              >
                <template v-slot:item.Estat="{ item }">
                  <v-btn
                    :style="getButtonStyle(item.Estat)"
                    @click="cambiarEstado(item)"
                  >
                    {{ item.Estat }}
                  </v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-snackbar
        :timeout="2500"
        color="success"
        variant="outlined"
        v-model="showAlert"
      >
        <template> </template>
        <span class="textAlert">Nova comanda afegida</span>
      </v-snackbar>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getComandes, updateEstat } from "../services/communicationManager.js";
import { funcionSockets } from "../services/socket-io.js";

const comandes = ref([]);
const search = ref("");
const statusFilter = ref(null);
const loading = ref(false);
const error = ref(null);
const estats = ref([
  "PENDENT_DE_PREPARACIO",
  "EN_PREPARACIO",
  "PREPARAT_PER_RECOLLIR",
  "RECOLLIT",
]);

const getButtonStyle = (status) => {
  switch (status) {
    case "PENDENT_DE_PREPARACIO":
      return { backgroundColor: "#FF6868", color: "white" };
    case "EN_PREPARACIO":
      return { backgroundColor: "#FFBB64", color: "white" };
    case "PREPARAT_PER_RECOLLIR":
      return { backgroundColor: "#FFEAA7", color: "black" };
    case "RECOLLIT":
      return { backgroundColor: "#DCFFB7", color: "black" };
  }
};

const showAlert = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const response = await getComandes();
    if (Array.isArray(response.comandes)) {
      comandes.value = response.comandes.map((comanda) => {
        if (Array.isArray(comanda.Productes)) {
          comanda.Productes = formatProductes(comanda.Productes);
        } else {
          console.error(
            "La propiedad Productes no es un array en una de las comandes"
          );
        }
        return comanda;
      });
      console.log(comandes.value);
    } else {
      console.error("El JSON de comandes no és un array");
    }
  } catch (err) {
    error.value = "Error al obtenir les comandes";
    console.error("Error al obtenir les comandes:", err);
  } finally {
    loading.value = false;
  }
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const filteredComandes = computed(() => {
  return comandes.value
    .filter((comanda) => {
      const matchesStatus = statusFilter.value
        ? comanda.Estat?.toLowerCase() === statusFilter.value.toLowerCase()
        : true;
      const matchesSearch = search.value
        ? comanda.idComanda.toString().includes(search.value)
        : true;
      return matchesStatus && matchesSearch;
    })
    .map((comanda) => ({
      ...comanda,
      data: formatDate(comanda.data),
    }));
});

const cambiarEstado = async (item) => {
  const currentStateIndex = estats.value.indexOf(item.Estat);
  const nextStateIndex = (currentStateIndex + 1) % estats.value.length;
  item.Estat = estats.value[nextStateIndex];

  try {
    await updateEstat(item.idComanda, item.Estat);
  } catch (error) {
    console.error("Error al actualizar el estado en la base de datos:", error);
  }
};

const formatProductes = (Productes) => {
  return Productes.map((producto) => {
    return `${producto.idProducte} ${producto.nomProducte} ${producto.quantitat}`;
  }).join(", ");
};

funcionSockets(comandes, formatProductes, showAlert);
</script>
<style scoped>
.textAlert {
  text-align: center;
  display: block;
  width: 100%;
}
.background {
  background-color: rgb(255, 251, 230);
}
.tit {
  color: rgb(255, 187, 100);
  text-shadow: 1px 1px 2px rgb(0, 0, 0);
}
.asd {
  background-color: rgb(253, 246, 209);
}
#asd {
  background-color: rgb(253, 246, 209);
}
</style>

