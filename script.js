console.log("Formulario desarrollado por www.ignovacion.com");

// Mostrar/ocultar secciones según el tipo de rendición
document.getElementById("tipoRendicion").addEventListener("change", function () {
    const tipo = this.value;
    document.getElementById("seccionVoucher").style.display = tipo === "voucher" ? "block" : "none";
    document.getElementById("seccionGastos").style.display = tipo === "gastos" ? "block" : "none";
});

// Configurar EmailJS
(function () {
    try {
        emailjs.init("WoF5qDCeRay2IRCrH"); // Public Key de EmailJS
        console.log("EmailJS configurado correctamente.");
    } catch (error) {
        console.error("Error al inicializar EmailJS:", error);
    }
})();

// Función para leer NFC y actualizar el campo destino
async function leerNFC(campoDestino) {
    if ('NDEFReader' in window) {
        try {
            const nfcReader = new NDEFReader();
            await nfcReader.scan();
            console.log("Escaneando NFC... Acerca el tag al dispositivo.");
            document.getElementById("status").innerText = "Escaneando NFC... Acerca el tag.";

            nfcReader.onreading = (event) => {
                let nfcData = "";
                for (const record of event.message.records) {
                    const decoder = new TextDecoder();
                    nfcData += decoder.decode(record.data);
                }

                // Mostrar datos leídos
                document.getElementById(campoDestino).value = nfcData.trim();
                document.getElementById("status").innerText = "Lectura completada con éxito.";
                console.log(`Datos leídos: ${nfcData}`);
            };
        } catch (error) {
            console.error("Error al leer NFC:", error);
            document.getElementById("status").innerText = "Error al leer NFC. Intenta de nuevo.";
            alert("Error al leer NFC: " + error.message);
        }
    } else {
        alert("Tu navegador no soporta la lectura NFC. Usa Google Chrome en Android.");
        console.log("NFC no disponible.");
    }
}

// Asignar eventos a los botones de escanear
document.getElementById("firmarResponsable").addEventListener("click", () => {
    leerNFC("responsable");
});

document.getElementById("firmarCoordinador").addEventListener("click", () => {
    leerNFC("coordinador");
});

// Envío del formulario con EmailJS
document.getElementById("formulario").addEventListener("submit", function (event) {
    event.preventDefault();

    // Datos del formulario
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
    };

    console.log("Enviando los siguientes datos:", templateParams);

    // Enviar datos con EmailJS
    emailjs.send("service_4u5obts", "template_5fi1hjp", templateParams)
        .then(function (response) {
            console.log("Correo enviado exitosamente:", response.status, response.text);
            document.body.innerHTML = `
                <h1 style="text-align: center; color: #4CAF50;">Datos enviados con éxito</h1>
                <p style="text-align: center; color: #333;">Gracias. Preparando el formulario para una nueva rendición...</p>
            `;
            setTimeout(() => window.location.reload(), 3000);
        }, function (error) {
            console.error("Error al enviar el formulario:", error);
            alert("Error al enviar el formulario. Revisa la consola para más detalles.");
        });
});
