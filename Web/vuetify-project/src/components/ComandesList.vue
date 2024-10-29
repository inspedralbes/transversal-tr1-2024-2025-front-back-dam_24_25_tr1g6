<template>
  <v-container>
    <v-row align="center" justify="space-between">
      <v-col cols="4">
        <h2>Llista de Comandes</h2>
      </v-col>
      <v-col cols="4" class="text-center">
        <v-text-field
          :loading="loading"
          v-model="search"
          append-inner-icon="mdi-magnify"
          density="compact"
          label="Buscar commandes per ID"
          variant="solo"
          hide-details
          single-line
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row align="center" justify="space-between" class="mt-4">
      <v-col cols="4">
        <v-select
          v-model="selectedStatus"
          :items="['Pendent de Preparar','En Preparació', 'Preparats', 'Entregats']"
          label="Filtrar per l'estat de la teva comanda"
          dense
          variant="solo"
          hide-details
          @change="cambiarSegunElStatus"
        ></v-select>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>

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