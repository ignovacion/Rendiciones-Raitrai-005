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

// Asociar botones NFC
document.getElementById("firmarResponsable").addEventListener("click", () => {
    leerNFC("responsable", "status");
});

document.getElementById("firmarCoordinador").addEventListener("click", () => {
    leerNFC("coordinador", "status");
});

// Enviar el formulario usando EmailJS
document.getElementById("formulario").addEventListener("submit", (event) => {
    event.preventDefault();

    const templateParams = {
        programa: document.getElementById("programa").value,
        actividad: document.getElementById("actividad").value,
        fecha: document.getElementById("fecha").value,
        colegio: document.getElementById("colegio").value,
        estudiantes: document.getElementById("estudiantes").value,
        apoderados: document.getElementById("apoderados").value,
        responsable: document.getElementById("responsable").value,
        correoResponsable: document.getElementById("correoResponsable").value,
        coordinador: document.getElementById("coordinador").value,
        correoCoordinador: document.getElementById("correoCoordinador").value,
        nfc: "Datos NFC firmados",
        destinoEmpresa: "contacto@ignovacion.com"
    };

    emailjs.send("TU_SERVICE_ID", "TU_TEMPLATE_ID", templateParams)
        .then(function (response) {
            console.log("Correo enviado exitosamente:", response.status, response.text);
            document.getElementById("status").innerText = "Formulario enviado correctamente.";
        }, function (error) {
            console.error("Error al enviar el correo:", error);
            document.getElementById("status").innerText = "Error al enviar el formulario.";
        });
});
