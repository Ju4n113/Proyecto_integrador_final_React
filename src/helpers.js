export function calcularTotal(cantidad, propiedad, ubicacion) {
  // Conversión de parámetros a tipos numéricos
  const cantidadInt = parseFloat(cantidad);
  const propiedadType = parseInt(propiedad);
  const ubicacionInt = parseInt(ubicacion);

  // Cálculo del costo basado en la cantidad
  let totalCantidad;
  if (cantidadInt <= 100) {
      totalCantidad = cantidadInt * 150; // Ejemplo: $1500 por cada metro cuadrado para cantidades menores o iguales a 100
  } else {
      totalCantidad = cantidadInt * 100; // Ejemplo: $1000 por cada metro cuadrado para cantidades mayores a 100
  }

  // Definición de valores para tipos de propiedad
  const propiedadValores = {
      1: 2000,  // Casa
      2: 1500,  // P.H.
      3: 1200,  // Depto. Edificio
      4: 1800,  // Barrio Privado
      5: 2500,  // Oficina
      6: 2200,  // Local Comercial
      7: 1700,  // Deposito Logistica
  };

  // Cálculo del costo basado en la ubicación utilizando un switch
  let totalUbicacion;
  switch (ubicacionInt) {
      case 24: // CABA
          totalUbicacion = totalCantidad * 200; // Doble del total si la ubicación es CABA
          break;
      case 12: // GBA
          totalUbicacion = totalCantidad * 150; // 1.5 veces el total si la ubicación es GBA
          break;
      case 10: // Prov. de Buenos Aires o Mendoza
          totalUbicacion = totalCantidad * 120; // 1.2 veces el total si la ubicación es Prov. de Buenos Aires o Mendoza
          break;
      default:
          totalUbicacion = totalCantidad; // Costo base si no coincide con ninguna ubicación específica
  }

  // Obtención del valor del tipo de propiedad o cero si no se encuentra
  const propiedadTotal = propiedadValores[propiedadType] || 0;

  // Cálculo del costo final agregando el costo de la propiedad
  const totalFinal = totalUbicacion + propiedadTotal;

  // Registro del resultado en la consola y retorno del valor
  console.log("Total Final:", totalFinal);
  return totalFinal;
}
