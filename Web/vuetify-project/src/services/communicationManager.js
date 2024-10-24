export async function getProductes() {
    const response = await fetch(`${import.meta.env.VITE_URL_BACK}/getProductes`);
    if (!response.ok) {
        throw new Error('Error al obtenir les dades');
    }

    const data = await response.json();

    return data;
}

export async function crearProductes(producte) {
    console.log("communication ", producte);
    try {
        const response = await fetch(`${import.meta.env.VITE_URL_BACK}/postProducte`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify(producte)
        });

        if (!response.ok) {
            throw new Error('Error afegint el producte');
        }

        const result = await response.json();
        return result;


    } catch (error) {
        console.error("Error en crearProductes: ", error);
    }
}

export async function modificarProducte(producte) {
    console.log("communication editing", producte);
    try {
        const response = await fetch(`${import.meta.env.VITE_URL_BACK}/putProducte/${producte.idProducte}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(producte)
        });

        if (!response.ok) {
            throw new Error('Error al modificar el producte');
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error("Error en modificarProducte: ", error);
    }
}

export async function eliminarProducte(idProducte) {
    console.log("communication deleting", idProducte);
    try {
        const response = await fetch(`${import.meta.env.VITE_URL_BACK}/deleteProduct/${idProducte}`, {
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


