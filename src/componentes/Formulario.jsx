import React, { useState } from 'react';
import { calcularTotal } from '../helpers';

/**
 * Componente del formulario para ingresar la información de la propiedad y calcular la cotización.
 * @param {number} cantidad - Cantidad de metros cuadrados.
 * @param {Function} setCantidad - Función para actualizar la cantidad de metros cuadrados.
 * @param {number} propiedad - Tipo de propiedad.
 * @param {Function} setPropiedad - Función para actualizar el tipo de propiedad.
 * @param {number} ubicacion - Ubicación de la propiedad.
 * @param {Function} setUbicacion - Función para actualizar la ubicación de la propiedad.
 * @param {Function} setTotal - Función para actualizar el total de la cotización.
 * @returns {JSX.Element} - La representación JSX del componente Formulario.
 */
const Formulario = ({ cantidad, setCantidad, propiedad, setPropiedad, ubicacion, setUbicacion, setTotal }) => {
    // Estado para gestionar la visualización del mensaje de error
    const [error, setError] = useState(false);

    /**
     * Función para calcular la cotización al enviar el formulario.
     * Realiza validaciones de entrada y muestra mensajes de error si es necesario.
     * @param {Object} e - Evento de envío del formulario.
     */
    const calcularPrestamo = e => {
        e.preventDefault();

        // Validación de metros cuadrados
        const metrosCuadrados = parseFloat(cantidad);
        if (metrosCuadrados <= 0 || isNaN(metrosCuadrados)) {
            setError(true);
            return;
        }

        // Validación de propiedad y ubicación
        if (!propiedad || !ubicacion) {
            setError(true);
            return;
        }

        // Validación de números negativos
        if (metrosCuadrados < 0) {
            setError(true);
            return;
        }

        setError(false);

        // Calcular el total de la cotización utilizando la función auxiliar calcularTotal
        const total = calcularTotal(cantidad, propiedad, ubicacion);
        setTotal(total);
    }

    // JSX que representa el formulario de entrada de información
    return ( 
        <>
            <form onSubmit={calcularPrestamo}>

                <div className="column">
                    <div>
                        <label>Seleccione su ubicación</label>
                        <select onChange={(e) => setUbicacion(e.target.value)}>
                            <option value="">Seleccionar</option>
                            <option value="24">CABA</option>
                            <option value="12">GBA</option>
                            <option value="10">Prov. de Buenos Aires</option>
                            <option value="10">Mendoza</option>
                        </select>
                    </div>

                    <div>
                        <label>Selecciona el tipo de propiedad</label>
                        <select onChange={(e) => setPropiedad(e.target.value)}>
                            <option value="">Seleccionar</option>
                            <option value="1">Casa</option>
                            <option value="2">P.H.</option>
                            <option value="3">Depto. Edificio</option>
                            <option value="4">Barrio Privado</option>
                            <option value="5">Oficina</option>
                            <option value="6">Local comercial</option>
                            <option value="7">Depósito Logística</option>
                        </select>
                    </div>

                    <div>
                        <label>Ingrese los metros cuadrados</label>
                        <input type="number" placeholder='Ej: 150'
                            onChange={(e) => setCantidad(e.target.value)}
                        />
                    </div>
                </div>

                <div className='btnSubmit'>
                    <input type="submit" value="Calcular"/>
                </div>
                
            </form>
            
            {/* Muestra un mensaje de error si existe un error de validación */}
            {(error) ? <p className='error'>{cantidad < 0 ? 'Ingresa una cantidad válida de metros cuadrados.' : 'Todos los campos son obligatorios.'}</p> : ""}
        </>
    );
}

export default Formulario;
