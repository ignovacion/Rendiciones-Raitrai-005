async function leerNFC(campoDestino, statusMsg) {
    if ('NDEFReader' in window) {
        try {
            const nfcReader = new NDEFReader();
            await nfcReader.scan();
            document.getElementById(statusMsg).innerText = "Escaneando Tag NFC...";

            nfcReader.onreading = (event) => {
                const nfcMessage = event.message.records[0];
                const nfcData = new TextDecoder().decode(nfcMessage.data);
                document.getElementById(campoDestino).value = nfcData;
                document.getElementById(statusMsg).innerText = "Firma completada.";
            };
        } catch (error) {
            console.error("Error al leer NFC:", error);
            document.getElementById(statusMsg).innerText = "Error al leer NFC. Intenta nuevamente.";
        }
    } else {
        document.getElementById(statusMsg).innerText = "Tu navegador no soporta NFC.";
    }
}

// Asociar los botones para cada firma NFC
document.getElementById("firmarResponsable").addEventListener("click", () => {
    leerNFC("responsable", "status");
});

document.getElementById("firmarCoordinador").addEventListener("click", () => {
    leerNFC("coordinador", "status");
});

// Manejar el envío del formulario
document.getElementById("formulario").addEventListener("submit", (event) => {
    event.preventDefault();
    const responsable = document.getElementById("responsable").value;
    const coordinador = document.getElementById("coordinador").value;

    if (!responsable || !coordinador) {
        document.getElementById("status").innerText = "Ambas firmas NFC son necesarias.";
        return;
    }

    console.log("Formulario Enviado:", {
        programa: document.getElementById("programa").value,
        actividad: document.getElementById("actividad").value,
        fecha: document.getElementById("fecha").value,
        colegio: document.getElementById("colegio").value,
        estudiantes: document.getElementById("estudiantes").value,
        apoderados: document.getElementById("apoderados").value,
        responsable,
        coordinador
    });

    document.getElementById("status").innerText = "Formulario enviado correctamente.";
});
