export async function getProductes() {
    const response = await fetch(`${import.meta.env.VITE_URL_BACK}/getProductesBD`);
    if (!response.ok) {
        throw new Error('Error al obtenir les dades');
    }

    const data = await response.json();

    return data;
}

export async function getComandes() {
    const response = await fetch(`${import.meta.env.VITE_URL_BACK}/getComandesBD`);
    if (!response.ok) {
        throw new Error('Error al obtenir les dades de les comandes');
    }

    const data = await response.json();

    return data;
}

export async function crearProductes(producte, Imatge) {
    console.log("postProduct & image", producte, Imatge);

    const formData = new FormData();
    formData.append('nomProducte', producte.nomProducte);
    formData.append('Descripcio', producte.Descripcio);
    formData.append('Preu', producte.Preu);
    formData.append('Stock', producte.Stock);
    formData.append('Imatge', Imatge);
    formData.append('Activat', producte.Activat);

    console.log("complete formData ", producte, Imatge);
    try {
        const response = await fetch(`${import.meta.env.VITE_URL_BACK}/postProducteBD`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Error afegint el producte');
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error("Error en crearProductes: ", error);
        throw error;
    }
}

export async function modificarProducte(producte, Imatge) {
    console.log("modifyProduct", producte);

    const formData = new FormData();
    formData.append('nomProducte', producte.nomProducte);
    formData.append('Descripcio', producte.Descripcio);
    formData.append('Preu', producte.Preu);
    formData.append('Stock', producte.Stock);
    formData.append('Imatge', Imatge);
    formData.append('Activat', producte.Activat);

    try {
        const response = await fetch(`${import.meta.env.VITE_URL_BACK}/putProducteBD/${producte.idProducte}`, {
            method: 'PUT',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Error al modificar el producte');
        }

        const updatedProduct = await response.json();
        return updatedProduct.producte;

    } catch (error) {
        console.error("Error en modificarProducte: ", error);
    }
}

export async function eliminarProducte(idProducte) {
    console.log("communication deleting", idProducte);
    try {
        const response = await fetch(`${import.meta.env.VITE_URL_BACK}/deleteProducteBD/${idProducte}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            throw new Error('Error al eliminar el producte');
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error("Error en eliminarProducte: ", error);
    }
}

// Esta es la función que haces para llamar al backend
export async function updateEstat(idComanda, Estat) {
    try {
        const response = await fetch(`${import.meta.env.VITE_URL_BACK}/putEstatBD/${idComanda}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Estat })
        });

        const data = await response.json();

        if (response.ok) {
            console.log(data.message); // Mensaje de éxito
        } else {
            console.error("Error al actualizar el estado:", data.message); // Manejo de error
        }
    } catch (err) {
        console.error("Error en la comunicación con el servidor:", err); // Error de red
    }
}


