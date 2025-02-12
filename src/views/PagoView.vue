<template>
    <div>
      <h1>Pago por Transferencia</h1>
      <p>Realiza la transferencia a:</p>
      <ul>
        <li><strong>Banco:</strong> Banco X</li>
        <li><strong>Cuenta:</strong> 123456789</li>
        <li><strong>Nombre:</strong> Bloomskin</li>
        <li><strong>Correo:</strong> contacto@bloomskin.cl</li>
      </ul>
      <label>Sube el comprobante:</label>
      <input type="file" @change="subirComprobante">
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      subirComprobante(event) {
        console.log("Archivo seleccionado:", event.target.files[0]);
        alert("Comprobante subido. Espera confirmación.");
      },
    },
  };
</script>
  