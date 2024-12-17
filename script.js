console.log("Formulario desarrollado por www.ignovacion.com");

// Mostrar/ocultar secciones según el tipo de rendición
document.getElementById("tipoRendicion").addEventListener("change", function () {
    const tipo = this.value;
    document.getElementById("seccionVoucher").style.display = tipo === "voucher" ? "block" : "none";
    document.getElementById("seccionGastos").style.display = tipo === "gastos" ? "block" : "none";
});

// Configurar EmailJS con tu Public Key
(function() {
    emailjs.init("WoF5qDCeRay2IRCrH"); // Public Key
})();

// Función para leer NFC
async function leerNFC(campoDestino) {
    if ('NDEFReader' in window) {
        try {
            const nfcReader = new NDEFReader();
            await nfcReader.scan();
            nfcReader.onreading = (event) => {
                const nfcMessage = event.message.records[0];
                const nfcData = new TextDecoder().decode(nfcMessage.data);
                document.getElementById(campoDestino).value = nfcData;
            };
        } catch (error) {
            alert("Error al leer NFC: " + error);
        }
    } else {
        alert("Tu navegador no soporta NFC.");
    }
}

// Botones de Escanear NFC
document.getElementById("firmarResponsable").addEventListener("click", () => {
    leerNFC("responsable");
});

document.getElementById("firmarCoordinador").addEventListener("click", () => {
    leerNFC("coordinador");
});

// Envío del formulario
document.getElementById("formulario").addEventListener("submit", function(event) {
    event.preventDefault();

    // Obtener los datos del formulario
    const tipo = document.getElementById("tipoRendicion").value;
    const templateParams = {
        tipo: tipo,
        programa: tipo === "voucher" ? document.getElementById("programa").value : document.getElementById("programaGasto").value,
        colegio: tipo === "voucher" ? document.getElementById("colegio").value : document.getElementById("colegioGasto").value,
        fecha: tipo === "voucher" ? document.getElementById("fecha").value : document.getElementById("fechaGasto").value,
        responsable: document.getElementById("responsable").value || "No aplica",
        correoResponsable: document.getElementById("correoResponsable").value || "No aplica",
        coordinador: document.getElementById("coordinador").value,
        correoCoordinador: document.getElementById("correoCoordinador").value,
        asuntoGasto: document.getElementById("asuntoGasto")?.value || "",
        valorGasto: document.getElementById("valorGasto")?.value || "",
        to_email: "contacto@ignovacion.com", // Correo principal
        cc_email: `${document.getElementById("correoResponsable").value},${document.getElementById("correoCoordinador").value}`
    };

    // Enviar los datos con EmailJS
    emailjs.send("service_4u5obts", "template_5fi1hjp", templateParams)
        .then(function(response) {
            console.log("Correo enviado exitosamente:", response.status, response.text);
            document.body.innerHTML = `
                <h1 style="text-align: center; color: #4CAF50;">Los datos rendidos se han enviado con éxito</h1>
                <p style="text-align: center; color: #333;">Preparando el formulario para una nueva rendición...</p>
            `;
            setTimeout(() => window.location.reload(), 3000);
        }, function(error) {
            console.error("Error al enviar el correo:", error);
            alert("Hubo un error al enviar el formulario. Intenta de nuevo.");
        });
});
