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
          :items="['Totes les comandes', 'Pendent_de_Preparar', 'En Preparació', 'Preparat per recollir', 'Recollit']"
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
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="filteredComandes"
              :loading="loading"
              class="elevation-1"
              hide-default-footer
            >
              <template v-slot:items="props">
                <tr>
                  <td>{{ props.item.id }}</td>
                  <td>{{ props.item.fecha }}</td>
                  <td>{{ props.item.cliente }}</td>
                  <td>{{ props.item.estado }}</td>
                </tr>
              </template>
            </v-data-table>
            <v-alert v-if="error" type="error">{{ error }}</v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getComandes } from "../services/communicationManager.js";

const comandes = ref([]);
const search = ref("");
const statusFilter = ref(null); 
const loading = ref(false);
const error = ref(null);
const headers = [
  { text: "idComanda", value: "idComanda" },
  { text: "idUsuari", value: "idUsuari" },
  { text: "Productes", value: "Productes" },
  { text: "PreuTotal", value: "PreuTotal" },
  { text: "Estat", value: "Estat" },
  { text: "data", value: "data" },
];

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

const totesLesComandes = () => {
  if (statusFilter.value = 'Totes les comandes'){
  }
}

const filteredComandes = computed(() => {
  return comandes.value.filter((comanda) => {
    const matchesStatus = statusFilter.value ? comanda.Estat?.toLowerCase() === statusFilter.value.toLowerCase(): true;
    const matchesSearch = search.value ? comanda.idComanda.toString().includes(search.value): true;
    return matchesStatus && matchesSearch;
  });
});


</script>
