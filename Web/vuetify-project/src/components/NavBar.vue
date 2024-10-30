<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>JUICE N'GO</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-layout class="overflow-visible" style="height: 56px">
      <v-bottom-navigation v-model="value" color="teal" grow rounded="lg">
        <v-btn to="/productes">
          <v-icon>mdi-history</v-icon>

          Productes
        </v-btn>

        <v-btn>
          <v-icon>mdi-heart</v-icon>

          Categories
        </v-btn>

        <v-btn to="/comandes">
          <v-icon>mdi-map-marker</v-icon>

          Comandes
        </v-btn>
      </v-bottom-navigation>
    </v-layout>
    <v-btn icon>
      <v-icon>mdi-account</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
</script>

<style scoped>
</style>