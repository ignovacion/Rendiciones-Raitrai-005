console.log("Formulario desarrollado por www.ignovacion.com");

const scriptURL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"; // Reemplaza YOUR_SCRIPT_ID con tu Script ID.

// Identificar Coordinador
document.getElementById("leerCoordinador").addEventListener("click", () => leerNFC("coordinador"));

// Leer Responsable para Voucher
document.getElementById("leerResponsable").addEventListener("click", () => leerNFC("responsable"));

// Tipo de Rendición
document.getElementById("tipoRendicion").addEventListener("change", function () {
    const tipo = this.value;
    document.querySelectorAll(".seccion").forEach((seccion) => seccion.style.display = "none");
    if (tipo === "voucher") {
        document.getElementById("seccionVoucher").style.display = "block";
    } else if (tipo === "gastos") {
        document.getElementById("seccionGastos").style.display = "block";
    }
    document.getElementById("enviar").style.display = "block";
});

// Función para leer NFC
async function leerNFC(tipo) {
    if ("NDEFReader" in window) {
        try {
            const nfcReader = new NDEFReader();
            await nfcReader.scan();
            mostrarMensaje("Escaneando NFC... Acerca el tag al dispositivo.", "orange");

            nfcReader.onreading = (event) => {
                console.log("Datos leídos del TAG NFC:", event.message.records);
                const lines = new TextDecoder().decode(event.message.records[0].data).split("\n");
                asignarCamposNFC(tipo, lines);
            };

            nfcReader.onreadingerror = () => {
                mostrarMensaje("Error al leer el TAG NFC. Inténtalo nuevamente.", "red");
            };
        } catch (error) {
            console.error("Error durante la lectura NFC:", error);
            mostrarMensaje("Error al leer NFC: " + error.message, "red");
        }
    } else {
        alert("NFC no soportado en este navegador. Usa Chrome en Android.");
    }
}

// Asignar los datos leídos
function asignarCamposNFC(tipo, datos) {
    console.log(`Asignando datos para: ${tipo}`);
    if (tipo === "coordinador") {
        document.getElementById("coordinador").value = datos[0] || "N/A";
        document.getElementById("codigoCoordinador").value = datos[1] || "N/A";
        document.getElementById("colegio").value = datos[2] || "N/A";
        document.getElementById("programa").value = datos[3] || "N/A";
        document.getElementById("estudiantes").value = datos[4] || "N/A";
        document.getElementById("apoderados").value = datos[5] || "N/A";
        document.getElementById("correoCoordinador").value = datos[6] || "N/A";
        document.getElementById("seleccionarRendicion").style.display = "block";
    } else if (tipo === "responsable") {
        document.getElementById("responsable").value = datos[0] || "N/A";
        document.getElementById("actividad").value = datos[1] || "N/A";
        document.getElementById("correoResponsable").value = datos[2] || "N/A";
    }
    mostrarMensaje("Lectura completada con éxito.", "green");
}

// Mostrar mensajes en la interfaz
function mostrarMensaje(mensaje, color) {
    const status = document.getElementById("status");
    status.style.color = color;
    status.innerText = mensaje;
}

// Enviar formulario
document.getElementById("enviar").addEventListener("click", () => {
    alert("Formulario enviado correctamente.");
});

