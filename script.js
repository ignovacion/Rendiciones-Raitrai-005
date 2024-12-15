// Función para leer NFC
async function leerNFC() {
    if ('NDEFReader' in window) {
        try {
            const nfcReader = new NDEFReader();
            await nfcReader.scan();
            document.getElementById("status").innerText = "Esperando datos del Tag NFC...";

            nfcReader.onreading = (event) => {
                const nfcMessage = event.message.records[0];
                const nfcData = new TextDecoder().decode(nfcMessage.data);
                document.getElementById("nfc").value = nfcData;
                document.getElementById("status").innerText = "Datos NFC leídos correctamente.";
            };
        } catch (error) {
            console.error("Error al leer NFC:", error);
            document.getElementById("status").innerText = "Error al leer NFC. Intenta nuevamente.";
        }
    } else {
        document.getElementById("status").innerText = "Tu navegador no soporta NFC.";
    }
}

// Asociar la función al botón "Firmar"
document.getElementById("firmarButton").addEventListener("click", leerNFC);

// Manejar el envío del formulario
document.getElementById("formulario").addEventListener("submit", (event) => {
    event.preventDefault();
    const programa = document.getElementById("programa").value;
    const actividad = document.getElementById("actividad").value;
    const fecha = document.getElementById("fecha").value;
    const coordinador = document.getElementById("coordinador").value;
    const colegio = document.getElementById("colegio").value;
    const estudiantes = document.getElementById("estudiantes").value;
    const apoderados = document.getElementById("apoderados").value;
    const nfc = document.getElementById("nfc").value;

    if (!programa || !actividad || !fecha || !coordinador || !colegio || !estudiantes || !apoderados || !nfc) {
        document.getElementById("status").innerText = "Por favor completa todos los campos.";
        return;
    }

    console.log("Formulario Enviado:", { programa, actividad, fecha, coordinador, colegio, estudiantes, apoderados, nfc });
    document.getElementById("status").innerText = "Formulario enviado correctamente.";
});
