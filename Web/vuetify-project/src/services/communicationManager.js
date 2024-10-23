export async function getProductes() {
    const response = await fetch('http://localhost:3001/getProductesJSON');
    if (!response.ok) {
        throw new Error('Error al obtenir les dades');
    }

    const data = await response.json();

    return data;
}

export async function crearProductes(producte) {
    console.log("communication ", producte);
    try {
        const response = await fetch('http://localhost:3001/postProducte', {
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

export async function modificarProducte() {

}

export async function eliminarProducte() {

}


