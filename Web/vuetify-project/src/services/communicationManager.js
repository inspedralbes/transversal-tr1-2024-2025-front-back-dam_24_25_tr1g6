export async function getProductes() {
    const response = await fetch('http://localhost:3001/getProductesJSON');
    if (!response.ok) {
        throw new Error('Error al obtenir les dades');
    }

    const data = await response.json();

    return data;
}


