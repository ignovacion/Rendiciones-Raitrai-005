console.log("Prueba de envío de correos con EmailJS.");

// Inicializar EmailJS
(function () {
    try {
        emailjs.init("WoF5qDCeRay2IRCrH"); // Public Key de EmailJS
        console.log("EmailJS inicializado correctamente.");
    } catch (error) {
        console.error("Error al inicializar EmailJS:", error);
        alert("Error al configurar EmailJS.");
    }
})();

// Envío del formulario
document.getElementById("formulario").addEventListener("submit", function (event) {
    event.preventDefault();

    // Datos del formulario
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
        asuntoGasto: document.getElementById("asuntoGasto")?.value || "",
        valorGasto: document.getElementById("valorGasto")?.value || "",
    };

    console.log("Enviando datos:", templateParams);

    // Enviar correo a través de EmailJS
    emailjs.send("service_4u5obts", "template_5fi1hjp", templateParams)
        .then(function (response) {
            console.log("Correo enviado exitosamente:", response.status, response.text);
            document.getElementById("status").style.color = "green";
            document.getElementById("status").innerText = "Correo enviado con éxito.";
            alert("Los datos se enviaron correctamente a los correos.");
        }, function (error) {
            console.error("Error al enviar el correo:", error);
            document.getElementById("status").style.color = "red";
            document.getElementById("status").innerText = "Error al enviar el correo. Intenta de nuevo.";
        });
});
