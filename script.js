console.log("Formulario desarrollado por www.ignovacion.com");

// Mostrar/ocultar secciones según el tipo de rendición
document.getElementById("tipoRendicion").addEventListener("change", function () {
    const tipo = this.value;
    document.getElementById("seccionVoucher").style.display = tipo === "voucher" ? "block" : "none";
    document.getElementById("seccionGastos").style.display = tipo === "gastos" ? "block" : "none";
});

// Función para leer NFC y actualizar el campo destino
async function leerNFC(campoDestino) {
    if ('NDEFReader' in window) {
        try {
            const nfcReader = new NDEFReader();
            await nfcReader.scan();
            console.log("Escaneando NFC... Acerca el tag al dispositivo.");

            document.getElementById("status").innerText = "Escaneando NFC... Acerca el tag.";

            nfcReader.onreading = (event) => {
                console.log("Evento de lectura NFC recibido", event);

                let nfcData = "";

                // Iterar sobre los registros de NFC
                for (const record of event.message.records) {
                    const decoder = new TextDecoder();
                    nfcData += decoder.decode(record.data);
                }

                // Mostrar los datos en el campo correspondiente
                document.getElementById(campoDestino).value = nfcData.trim();
                document.getElementById("status").innerText = "Lectura completada con éxito.";

                console.log(`Datos leídos: ${nfcData}`);
            };

        } catch (error) {
            console.error("Error al leer NFC:", error);
            alert("Error al leer NFC. Intenta de nuevo.");
            document.getElementById("status").innerText = "Error al leer NFC.";
        }
    } else {
        alert("Tu navegador no soporta NFC. Usa Google Chrome en Android.");
        console.log("NFC no disponible en este navegador.");
    }
}

// Asignar eventos a los botones de escanear
document.getElementById("firmarResponsable").addEventListener("click", () => {
    leerNFC("responsable");
});

document.getElementById("firmarCoordinador").addEventListener("click", () => {
    leerNFC("coordinador");
});

// Envío del formulario
document.getElementById("formulario").addEventListener("submit", function (event) {
    event.preventDefault();

    document.body.innerHTML = `
        <h1 style="text-align: center; color: #4CAF50;">Los datos rendidos se han enviado con éxito</h1>
        <p style="text-align: center; color: #333;">Preparando el formulario para una nueva rendición...</p>
    `;
    setTimeout(() => window.location.reload(), 3000);
});
