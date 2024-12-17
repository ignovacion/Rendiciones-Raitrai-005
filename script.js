console.log("Formulario desarrollado por www.ignovacion.com");

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

// Función para mostrar mensajes
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

// Envío del formulario a Google Sheets
document.getElementById("formulario").addEventListener("submit", (event) => {
    event.preventDefault();

    // Capturar datos del formulario
    const tipo = document.getElementById("tipoRendicion").value;
    const data = {
        tipo: tipo,
        programa: tipo === "voucher" ? document.getElementById("programa").value : document.getElementById("programaGasto").value,
        colegio: tipo === "voucher" ? document.getElementById("colegio").value : document.getElementById("colegioGasto").value,
        fecha: tipo === "voucher" ? document.getElementById("fecha").value : document.getElementById("fechaGasto").value,
        responsables: document.getElementById("responsable").value || "No aplica",
        correoResponsable: document.getElementById("correoResponsable")?.value || "No aplica",
        coordinador: document.getElementById("coordinador").value,
        correoCoordinador: document.getElementById("correoCoordinador").value,
        valorGasto: document.getElementById("valorGasto")?.value || "",
        asuntoGasto: document.getElementById("asuntoGasto")?.value || "",
    };

    // Crear FormData para manejar archivos (si aplica)
    const formData = new FormData();
    for (const key in data) {
        formData.append(key, data[key]);
    }

    // Adjuntar archivo si existe
    const fileInput = document.getElementById("imagenGasto");
    if (fileInput && fileInput.files.length > 0) {
        formData.append("imagenGasto", fileInput.files[0]);
    }

    // Enviar datos al Web App de Google Apps Script
    fetch("https://script.google.com/macros/s/AKfycbz1rrJ3CasBVxGQU9mdlCDXc8fDxcGd93ceA5RTn2OHzlDZKPkHG-KuX06eP9ee6xjocg/exec", {
        method: "POST",
        body: formData,
    })
        .then((response) => response.text())
        .then((result) => {
            console.log(result);
            mostrarMensaje("Los datos rendidos se han enviado con éxito.", "green");
            document.body.innerHTML = `
                <h1 style="text-align: center; color: #4CAF50;">Los datos rendidos se han enviado con éxito</h1>
                <p style="text-align: center; color: #333;">Preparando el formulario para una nueva rendición...</p>
            `;
            setTimeout(() => window.location.reload(), 3000);
        })
        .catch((error) => {
            console.error("Error al enviar los datos:", error);
            mostrarMensaje("Hubo un error al enviar los datos. Intenta de nuevo.", "red");
        });
});
