<template>
  <v-container>
    <v-row>
      <v-col cols="6" class="text-left">
        <v-text-field
          :loading="loading"
          v-model="search"
          append-inner-icon="mdi-magnify"
          density="compact"
          label="Buscar Comanda per ID"
          variant="solo"
          hide-details
          single-line
        ></v-text-field>
      </v-col>
      <v-col cols="6" class="text-right">
        <v-select
          v-model="statusFilter"
          :items="['Pendent de Preparar', 'En Preparació', 'Preparat per recollir', 'Recollit']"
          label="Filtrar per Estat"
          prepend-icon="mdi-filter"
          dense
          outlined
          @change="totesLesComandes"
          hide-details
        ></v-select>
      </v-col>
    </v-row>
  </v-container>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            <h2>Comandes</h2>
            <v-btn
            @click="updateEstat">
              Actualitzar estat
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="filteredComandes"
              :loading="loading"
              class="elevation-1"
              hide-default-footer>
              <template v-slot:item.Estat="{ item }">
              <v-select
                v-model="item.Estat"
                :items="['Pendent de Preparar', 'En Preparació', 'Preparat per recollir', 'Recollit']"
                dense
                @change="updateEstat(item)"
                outlined
              ></v-select>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getComandes, updateEstat } from "../services/communicationManager.js";

const comandes = ref([]);
const search = ref("");
const statusFilter = ref(null); 
const loading = ref(false);
const error = ref(null);

onMounted(async () => {
  loading.value = true;
  try {
    const response = await getComandes();
    if (Array.isArray(response.comandes)) {
      comandes.value = response.comandes;
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
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`; 
}

const filteredComandes = computed(() => {
  return comandes.value
    .filter((comanda) => {
      const matchesStatus = statusFilter.value ? comanda.Estat?.toLowerCase() === statusFilter.value.toLowerCase() : true;
      const matchesSearch = search.value ? comanda.idComanda.toString().includes(search.value) : true;
      return matchesStatus && matchesSearch;
    })
    .map(comanda => ({
      ...comanda,
      data: formatDate(comanda.data)
    }));
});

</script>