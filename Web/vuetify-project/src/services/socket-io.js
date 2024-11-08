import { io } from "socket.io-client";

const socket = io("http://localhost:3010");

export const funcionSockets = (comandes, formatProductes, showAlert) => {
  socket.on("new-comanda", (newComanda) => {
    console.log(newComanda);
    if (Array.isArray(newComanda.Productes)) {
      newComanda.Productes = formatProductes(newComanda.Productes);
    } else {
      console.error("La propiedad Productes no es un array en la nueva comanda");
    }
    comandes.value.push(newComanda);
    showAlert.value = true;
    console.log(comandes.value);
  });
};
