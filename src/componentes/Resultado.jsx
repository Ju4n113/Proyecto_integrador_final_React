import React from 'react';

/**
 * Componente que muestra el resultado de la cotización, incluyendo detalles sobre el inmueble y el costo estimado del seguro.
 * @param {Object} props - Propiedades del componente.
 * @param {number} props.total - Costo total de la póliza.
 * @param {number} props.cantidad - Metros cuadrados del inmueble.
 * @param {number} props.propiedad - Tipo de inmueble (código).
 * @param {number} props.ubicacion - Ubicación del inmueble (código).
 * @returns {JSX.Element} - La representación JSX del componente Resultado.
 */
const Resultado = ({ total, cantidad, propiedad, ubicacion }) => {
    // Mapear valores a nombres correspondientes
    const tipoInmuebleNombres = {
        1: 'Casa',
        2: 'P.H.',
        3: 'Depto. Edificio',
        4: 'Barrio Privado',
        5: 'Oficina',
        6: 'Local Comercial',
        7: 'Depósito Logística',
    };

    const ubicacionNombres = {
        24: 'CABA',
        12: 'GBA',
        10: 'Prov. de Buenos Aires',
    };

    return (
        <div className='resultado'>
            <h2>Cotización:</h2>
            <p>Tu inmueble de {cantidad} metros cuadrados.</p>
            <p>Tipo de inmueble: {tipoInmuebleNombres[propiedad]}.</p>
            <p>Ubicado en: {ubicacionNombres[ubicacion]}.</p>
            <p>El costo estimado del seguro es de: ${total}.</p>
        </div>
    );
}

export default Resultado;
