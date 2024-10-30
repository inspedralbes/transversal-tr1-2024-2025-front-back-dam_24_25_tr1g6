<template>
  <v-container>
    <!-- Barra de búsqueda y filtro por estado -->
    <v-row>
      <v-col cols="6" class="text-left">
        <v-text-field
          :loading="loading"
          v-model="search"
          append-inner-icon="mdi-magnify"
          density="compact"
          label="Buscar Comanda por Cliente"
          variant="solo"
          hide-details
          single-line
        ></v-text-field>
      </v-col>
      <v-col cols="6" class="text-right">
        <v-select
          v-model="statusFilter"
          :items="['Pendent de Preparar', 'En Preparar', 'Preparats', 'Entregats']"
          label="Filtrar por Estado"
          prepend-icon="mdi-filter"
          dense
          outlined
          hide-details
        ></v-select>
      </v-col>
    </v-row>

    <!-- Lista de comandas -->
    <v-row>
      <v-col cols="12">
        <v-list>
          <v-list-item
            v-for="comanda in filteredComandes"
            :key="comanda.idComanda"
            class="comanda-list-item"
          >
            <v-row align="center">
              <v-col cols="3">
                <v-list-item-title>{{ comanda.client }}</v-list-item-title>
              </v-col>
              <v-col cols="2">
                <v-list-item-subtitle>{{ comanda.data }}</v-list-item-subtitle>
              </v-col>
              <v-col cols="2">
                <v-list-item-subtitle>{{ comanda.total }} €</v-list-item-subtitle>
              </v-col>
              <v-col cols="2">
                <v-list-item-subtitle>{{ comanda.status }}</v-list-item-subtitle>
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
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
              :items="comandes"
              :loading="loading"
              class="elevation-1"
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
const statusFilter = ref(""); 
const loading = ref(false);

onMounted(async () => {
  try {
    const response = await getComandes();
    if (Array.isArray(response.comandes)) {
      comandes.value = response.comandes;
    } else {
      console.error("El JSON de comandas no es un array");
    }
  } catch (error) {
    console.error("Error al obtener las comandas:", error);
  }
});
</script>