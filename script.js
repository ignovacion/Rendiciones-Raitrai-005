console.log("Formulario desarrollado por www.ignovacion.com");

// Inicializar EmailJS
(function () {
    emailjs.init("WoF5qDCeRay2IRCrH"); // Public Key de EmailJS
    console.log("EmailJS inicializado correctamente.");
})();

// Función para mostrar mensajes en pantalla
function mostrarMensaje(mensaje, color) {
    const status = document.getElementById("status");
    status.style.color = color;
    status.innerText = mensaje;
}

// Envío del formulario
document.getElementById("formulario").addEventListener("submit", function (event) {
    event.preventDefault();

    // Capturar datos del formulario
    const tipo = document.getElementById("tipoRendicion").value;
    const templateParams = {
        tipo: tipo,
        programa: tipo === "voucher" ? document.getElementById("programa").value : document.getElementById("programaGasto").value,
        colegio: tipo === "voucher" ? document.getElementById("colegio").value : document.getElementById("colegioGasto").value,
        fecha: tipo === "voucher" ? document.getElementById("fecha").value : document.getElementById("fechaGasto").value,
        responsable: document.getElementById("responsable")?.value || "No aplica",
        correoResponsable: document.getElementById("correoResponsable")?.value || "No aplica",
        coordinador: document.getElementById("coordinador").value,
        correoCoordinador: document.getElementById("correoCoordinador").value,
    };

    console.log("Enviando datos a EmailJS:", templateParams);

    // Enviar los datos con EmailJS
    emailjs.send("service_4u5obts", "template_5fi1hjp", templateParams)
        .then(function (response) {
            console.log("Correo enviado exitosamente:", response.status, response.text);
            mostrarMensaje("¡Los datos se han enviado con éxito!", "green");

            // Limpiar el formulario después del envío
            setTimeout(() => {
                document.getElementById("formulario").reset();
                document.getElementById("status").innerText = "";
            }, 3000);
        }, function (error) {
            console.error("Error al enviar el formulario:", error);
            mostrarMensaje("Error al enviar los datos. Inténtalo de nuevo.", "red");
        });
});
