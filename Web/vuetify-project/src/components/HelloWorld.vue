<template>
   <v-app class="background">
  <h2 class="Bienvenida">Pàgina d'administració de productes i comandes de JuiceN'Go!!</h2>
  <h3 class="text2">Logo de la nostra tenda</h3>
  <div class="Logo-container">
  <v-img class="Logo" src="../assets/Logo_Juice_N'Go.jpg"/>
  </div>
</v-app>
</template>
<script setup>
</script>
<style>
.Bienvenida {
  margin-top: 70px;             
  color: #ffff;               
  text-shadow: 2px 2px 4px rgb(0, 0, 0); 
  font-weight: bold;            
  font-size: 1.8em;           
  text-align: center;
}
.background {
  background-color: rgb(255, 251, 230); 
  min-height: 100vh; 
}
.text2{
  margin-top: 20px;            
  color: #ffff;               
  text-shadow: 2px 2px 4px rgb(0, 0, 0); 
  font-weight: bold;
  text-align: center;
}
.Logo{
  max-width: 40%;
}
.Logo-container {
  display: flex;
  justify-content: center;       
  height: 100vh;
  }
</style>
