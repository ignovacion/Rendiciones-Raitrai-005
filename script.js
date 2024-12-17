console.log("Formulario desarrollado por www.ignovacion.com");

// Inicializar EmailJS
(function () {
    emailjs.init("WoF5qDCeRay2IRCrH"); // Public Key de EmailJS
    console.log("EmailJS inicializado correctamente.");
})();

// Mostrar/ocultar secciones según el tipo de rendición
document.getElementById("tipoRendicion").addEventListener("change", function () {
    const tipo = this.value;
    document.getElementById("seccionVoucher").style.display = tipo === "voucher" ? "block" : "none";
    document.getElementById("seccionGastos").style.display = tipo === "gastos" ? "block" : "none";
});

// Función para leer NFC y actualizar un campo
async function leerNFC(campoDestino) {
    if ("NDEFReader" in window) {
        try {
            const nfcReader = new NDEFReader();
            await nfcReader.scan();
            console.log("Escaneando NFC... Acerca el tag al dispositivo.");

            nfcReader.onreading = (event) => {
                let nfcData = "";
                for (const record of event.message.records) {
                    const decoder = new TextDecoder();
                    nfcData += decoder.decode(record.data);
                }
                document.getElementById(campoDestino).value = nfcData.trim();
                mostrarMensaje("Lectura completada con éxito.", "green");
            };
        } catch (error) {
            console.error("Error al leer NFC:", error);
            mostrarMensaje("Error al leer NFC. Intenta de nuevo.", "red");
        }
    } else {
        alert("NFC no soportado en este navegador. Usa Chrome en Android.");
    }
}

// Función para mostrar mensajes en la pantalla
function mostrarMensaje(mensaje, color) {
    const status = document.getElementById("status");
    status.style.color = color;
    status.innerText = mensaje;
}

// Eventos de botones NFC
document.getElementById("firmarResponsable").addEventListener("click", () => {
    leerNFC("responsable");
});

document.getElementById("firmarCoordinador").addEventListener("click", () => {
    leerNFC("coordinador");
});

// Envío del formulario a EmailJS
document.getElementById("formulario").addEventListener("submit", function (event) {
    event.preventDefault();

    const tipo = document.getElementById("tipoRendicion").value;
    const archivo = document.getElementById("imagenGasto")?.files[0];

    // Capturar datos del formulario
    const templateParams = {
        tipo: tipo,
        programa: tipo === "voucher" ? document.getElementById("programa").value : document.getElementById("programaGasto").value,
        colegio: tipo === "voucher" ? document.getElementById("colegio").value : document.getElementById("colegioGasto").value,
        fecha: tipo === "voucher" ? document.getElementById("fecha").value : document.getElementById("fechaGasto").value,
        responsable: document.getElementById("responsable")?.value || "No aplica",
        correoResponsable: document.getElementById("correoResponsable")?.value || "No aplica",
        coordinador: document.getElementById("coordinador").value,
        correoCoordinador: document.getElementById("correoCoordinador").value,
        asuntoGasto: document.getElementById("asuntoGasto")?.value || "",
        valorGasto: document.getElementById("valorGasto")?.value || "",
    };

    console.log("Enviando datos a EmailJS:", templateParams);

    // Si hay archivo, lo convertimos a Base64
    if (archivo) {
        const reader = new FileReader();
        reader.onload = function (e) {
            templateParams.archivoBase64 = e.target.result; // Archivo en Base64
            enviarEmail(templateParams);
        };
        reader.readAsDataURL(archivo);
    } else {
        enviarEmail(templateParams);
    }
});

// Función para enviar correo con EmailJS
function enviarEmail(params) {
    emailjs.send("service_4u5obts", "template_5fi1hjp", params)
        .then(function (response) {
            console.log("Correo enviado exitosamente:", response.status, response.text);
            mostrarMensaje("¡Datos enviados con éxito!", "green");
            setTimeout(() => window.location.reload(), 3000); // Refresca el formulario
        }, function (error) {
            console.error("Error al enviar correo:", error);
            mostrarMensaje("Error al enviar el formulario. Intenta de nuevo.", "red");
        });
}
