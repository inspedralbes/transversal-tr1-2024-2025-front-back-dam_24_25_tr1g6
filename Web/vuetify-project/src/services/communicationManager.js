export async function getProductes() {
    const response = await fetch(`${import.meta.env.VITE_URL_BACK}/getProductesBD`);
    if (!response.ok) {
        throw new Error('Error al obtenir les dades');
    }

    const data = await response.json();

    return data;
}

export async function crearProductes(producteFormData) {
    console.log("communication ", producte);
    try {
        const response = await fetch(`${import.meta.env.VITE_URL_BACK}/postProducteBD`, {
            method: 'POST',

            body: producteFormData
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

export async function modificarProducte(producte) {
    console.log("communication editing", producte);
    try {
        const response = await fetch(`${import.meta.env.VITE_URL_BACK}/putProducteBD/${producte.idProducte}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(producte)
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
            headers: {
                'Content-Type': 'application/json',
            },
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


