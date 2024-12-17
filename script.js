console.log("Formulario desarrollado por www.ignovacion.com");

// Mostrar/ocultar secciones según el tipo de rendición
document.getElementById("tipoRendicion").addEventListener("change", function () {
    const tipo = this.value;
    document.getElementById("seccionVoucher").style.display = tipo === "voucher" ? "block" : "none";
    document.getElementById("seccionGastos").style.display = tipo === "gastos" ? "block" : "none";
});

// Inicializar EmailJS
(function () {
    emailjs.init("WoF5qDCeRay2IRCrH"); // Public Key de EmailJS
    console.log("EmailJS inicializado.");
})();

// Función para mostrar errores en la pantalla
function mostrarError(mensaje) {
    const status = document.getElementById("status");
    status.style.color = "red";
    status.innerText = mensaje;
}

// Función para mostrar mensajes de éxito
function mostrarExito(mensaje) {
    const status = document.getElementById("status");
    status.style.color = "green";
    status.innerText = mensaje;
}

// Función de lectura NFC
async function leerNFC(campoDestino) {
    if ('NDEFReader' in window) {
        try {
            const nfcReader = new NDEFReader();
            await nfcReader.scan();
            console.log("Escaneando NFC... Acerca el tag al dispositivo.");
            document.getElementById("status").innerText = "Escaneando NFC...";

            nfcReader.onreading = (event) => {
                let nfcData = "";
                for (const record of event.message.records) {
                    const decoder = new TextDecoder();
                    nfcData += decoder.decode(record.data);
                }
                document.getElementById(campoDestino).value = nfcData.trim();
                mostrarExito("Lectura completada con éxito.");
                console.log(`Datos leídos: ${nfcData}`);
            };
        } catch (error) {
            console.error("Error al leer NFC:", error);
            mostrarError("Error al leer NFC. Intenta de nuevo.");
        }
    } else {
        mostrarError("NFC no soportado en este navegador.");
    }
}

// Eventos de botones de lectura NFC
document.getElementById("firmarResponsable").addEventListener("click", () => {
    leerNFC("responsable");
});

document.getElementById("firmarCoordinador").addEventListener("click", () => {
    leerNFC("coordinador");
});

// Envío del formulario
document.getElementById("formulario").addEventListener("submit", function (event) {
    event.preventDefault();

    const tipo = document.getElementById("tipoRendicion").value;
    const archivo = document.getElementById("imagenGasto")?.files[0];

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

    // Si hay archivo, lo convertimos a Base64
    if (archivo) {
        const reader = new FileReader();
        reader.onload = function (e) {
            templateParams.archivoBase64 = e.target.result;
            enviarCorreo(templateParams);
        };
        reader.readAsDataURL(archivo);
    } else {
        enviarCorreo(templateParams);
    }
});

// Función para enviar correo con EmailJS
function enviarCorreo(params) {
    console.log("Enviando datos a EmailJS:", params);

    emailjs.send("service_4u5obts", "template_5fi1hjp", params)
        .then(function (response) {
            console.log("Correo enviado exitosamente:", response.status, response.text);
            document.body.innerHTML = `
                <h1 style="text-align: center; color: #4CAF50;">Datos enviados con éxito</h1>
                <p style="text-align: center; color: #333;">Gracias. Preparando el formulario...</p>
            `;
            setTimeout(() => window.location.reload(), 3000);
        }, function (error) {
            console.error("Error al enviar el formulario:", error);
            mostrarError("Error al enviar los datos. Revisa tu conexión e intenta de nuevo.");
        });
}
