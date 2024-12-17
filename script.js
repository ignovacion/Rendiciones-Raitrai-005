console.log("Formulario desarrollado por www.ignovacion.com");

// Mostrar/ocultar secciones según el tipo de rendición
document.getElementById("tipoRendicion").addEventListener("change", function () {
    const tipo = this.value;
    document.getElementById("seccionVoucher").style.display = tipo === "voucher" ? "block" : "none";
    document.getElementById("seccionGastos").style.display = tipo === "gastos" ? "block" : "none";
    mostrarMensaje("Cuando estén todos los campos rellenos, presiona Enviar.", "blue");
});

// Función para leer NFC y actualizar un campo
async function leerNFC(campoDestino) {
    if ("NDEFReader" in window) {
        try {
            const nfcReader = new NDEFReader();
            await nfcReader.scan();
            mostrarMensaje("Escaneando NFC... Acerca el tag al dispositivo.", "orange");

            nfcReader.onreading = (event) => {
                let nfcData = "";
                for (const record of event.message.records) {
                    const decoder = new TextDecoder();
                    nfcData += decoder.decode(record.data);
                }
                document.getElementById(campoDestino).value = nfcData.trim();
                mostrarMensaje("Lectura completada con éxito.", "green");
                nfcReader.onreading = null; // Cerrar lectura
            };
        } catch (error) {
            console.error("Error al leer NFC:", error);
            mostrarMensaje("Error al leer NFC. Intenta de nuevo.", "red");
        }
    } else {
        alert("NFC no soportado en este navegador. Usa Chrome en Android.");
    }
}

// Función para mostrar mensajes temporales
function mostrarMensaje(mensaje, color) {
    const status = document.getElementById("status");
    status.style.color = color;
    status.innerText = mensaje;

    setTimeout(() => {
        status.innerText = "Cuando estén todos los campos rellenos, presiona Enviar.";
        status.style.color = "blue";
    }, 5000);
}

// Botones de lectura NFC
document.getElementById("firmarResponsable").addEventListener("click", () => leerNFC("responsable"));
document.getElementById("firmarCoordinador").addEventListener("click", () => leerNFC("coordinador"));

// Envío del formulario
document.getElementById("formulario").addEventListener("submit", async (event) => {
    event.preventDefault();
    const tipo = document.getElementById("tipoRendicion").value;

    // Capturar datos de Rendición de Voucher
    let data = {};
    if (tipo === "voucher") {
        data = {
            tipo: "Rendición de Voucher",
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
        };
    } 
    // Capturar datos de Rendición de Gastos
    else if (tipo === "gastos") {
        data = {
            tipo: "Rendición de Gastos",
            programa: document.getElementById("programaGasto").value,
            colegio: document.getElementById("colegioGasto").value,
            fecha: document.getElementById("fechaGasto").value,
            asunto: document.getElementById("asuntoGasto").value,
            valor: document.getElementById("valorGasto").value,
            coordinador: document.getElementById("coordinador").value,
            correoCoordinador: document.getElementById("correoCoordinador").value,
        };
    }

    // FormData para enviar
    const formData = new FormData();
    for (const key in data) {
        formData.append(key, data[key]);
    }

    // Adjuntar archivo si es Gastos
    if (tipo === "gastos") {
        const fileInput = document.getElementById("imagenGasto");
        if (fileInput.files.length > 0) {
            formData.append("imagenGasto", fileInput.files[0]);
        }
    }

    // Enviar datos a Google Apps Script
    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbz1rrJ3CasBVxGQU9mdlCDXc8fDxcGd93ceA5RTn2OHzlDZKPkHG-KuX06eP9ee6xjocg/exec", {
            method: "POST",
            body: formData,
        });

        const result = await response.text();
        console.log(result);
        mostrarMensaje("Los datos se enviaron con éxito.", "green");
        document.body.innerHTML = `
            <h1 style="text-align: center; color: #4CAF50;">Los datos rendidos se han enviado con éxito</h1>
            <p style="text-align: center;">Preparando el formulario para una nueva rendición...</p>
        `;
        setTimeout(() => window.location.reload(), 3000);
    } catch (error) {
        console.error("Error al enviar los datos:", error);
        mostrarMensaje("Hubo un error al enviar los datos. Intenta nuevamente.", "red");
    }
});
