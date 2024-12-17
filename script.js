console.log("Formulario desarrollado por www.ignovacion.com");

// Mostrar formulario según el tipo de rendición
document.getElementById("tipoRendicion").addEventListener("change", function () {
    const tipo = this.value;
    document.getElementById("seccionVoucher").style.display = tipo === "voucher" ? "block" : "none";
    document.getElementById("seccionGastos").style.display = tipo === "gastos" ? "block" : "none";
    mostrarMensaje("Completa el formulario y presiona Enviar.", "blue");
});

// Función para leer NFC
async function leerNFC(campoDestino) {
    if ("NDEFReader" in window) {
        try {
            const nfcReader = new NDEFReader();
            await nfcReader.scan();
            mostrarMensaje("Escaneando NFC... Acerca el tag al dispositivo.", "orange");

            nfcReader.onreading = (event) => {
                const nfcData = new TextDecoder().decode(event.message.records[0].data);
                document.getElementById(campoDestino).value = nfcData.trim();
                mostrarMensaje("Lectura completada con éxito.", "green");
            };
        } catch (error) {
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
document.getElementById("firmarResponsable").addEventListener("click", () => leerNFC("responsable"));
document.getElementById("firmarCoordinador").addEventListener("click", () => leerNFC("coordinador"));

// Enviar formulario a Google Apps Script
document.getElementById("formulario").addEventListener("submit", async (event) => {
    event.preventDefault();

    const tipo = document.getElementById("tipoRendicion").value;
    const formData = new FormData();

    if (tipo === "voucher") {
        formData.append("tipo", "Rendición de Voucher");
        formData.append("programa", document.getElementById("programa").value);
        formData.append("actividad", document.getElementById("actividad").value);
        formData.append("fecha", document.getElementById("fecha").value);
        formData.append("colegio", document.getElementById("colegio").value);
        formData.append("responsable", document.getElementById("responsable").value);
        formData.append("correoResponsable", document.getElementById("correoResponsable").value);
    } else if (tipo === "gastos") {
        formData.append("tipo", "Rendición de Gastos");
        formData.append("programa", document.getElementById("programaGasto").value);
        formData.append("colegio", document.getElementById("colegioGasto").value);
        formData.append("fecha", document.getElementById("fechaGasto").value);
        formData.append("asunto", document.getElementById("asuntoGasto").value);
        formData.append("valor", document.getElementById("valorGasto").value);
    }

    formData.append("coordinador", document.getElementById("coordinador").value);
    formData.append("correoCoordinador", document.getElementById("correoCoordinador").value);

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
