// src/components/QuoteForm.jsx
import { useState, useEffect } from 'react';
import { insuranceConfig } from '../config/insuranceConfig.js';

/**
 * Componente QuoteForm:
 * Contiene el formulario para que el usuario ingrese los datos del viaje.
 * Se encarga de la validación y el cálculo de la cotización.
 */
const QuoteForm = ({ onQuote, onFormChange }) => {
    // --- State Management ---
    const [travelers, setTravelers] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [days, setDays] = useState(0);
    const [ages, setAges] = useState(['']);
    const [error, setError] = useState('');

    // Efecto para calcular los días de viaje cuando las fechas cambian
    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (end < start) {
                setError('La fecha de regreso no puede ser anterior a la fecha de salida.');
                setDays(0);
                return;
            }

            // La diferencia se calcula en milisegundos, se convierte a días.
            // Se suma 1 para que el día de salida y el de regreso cuenten como días completos de cobertura.
            const diffTime = end.getTime() - start.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            
            setDays(diffDays);
            setError(''); // Limpiar error si las fechas son válidas
            onFormChange(); // Notificar al componente padre que los datos han cambiado
        }
    }, [startDate, endDate]);


    // --- Helper Functions ---

    /**
     * getPriceForAge: Busca el precio diario para un viajero según su edad en un plan específico.
     * @param {object} plan - El objeto del plan de seguro.
     * @param {number} age - La edad del viajero.
     * @returns {number|null} - El precio diario o null si no se encuentra una regla aplicable.
     */
    const getPriceForAge = (plan, age) => {
        for (const rangeKey in plan.rules) {
            const [min, max] = rangeKey.split('-').map(Number);
            if (age >= min && age <= max) {
                return plan.rules[rangeKey];
            }
        }
        return null;
    };


    // --- Event Handlers ---

    const handleTravelersChange = (e) => {
        let count = parseInt(e.target.value, 10);
        if (isNaN(count) || count < 1) count = 1;
        if (count > 20) {
            setError('Para grupos mayores a 20 personas, por favor contáctanos.');
            count = 20;
        } else {
            setError('');
        }
        setTravelers(count);
        setAges(new Array(count).fill(''));
        onFormChange();
    };

    const handleAgeChange = (index, value) => {
        const newAges = [...ages];
        newAges[index] = value;
        setAges(newAges);
        onFormChange();
    };

    const handleQuoteSubmit = (e) => {
        e.preventDefault();
        setError('');

        // --- Validaciones ---
        if (!startDate || !endDate) {
            setError('Por favor, seleccioná las fechas de salida y regreso.');
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end < start) {
            setError('La fecha de regreso no puede ser anterior a la fecha de salida.');
            return;
        }

        const numericAges = ages.map(age => parseInt(age, 10));
        if (numericAges.some(isNaN)) {
            setError('Por favor, completá la edad de todos los viajeros.');
            return;
        }

        // --- Lógica de cálculo ---
        const calculatedResults = [];

        insuranceConfig.forEach(provider => {
            provider.plans.forEach(plan => {
                if (days < plan.minDays) return;

                let dailyPriceSum = 0;
                let isPlanApplicable = true;

                for (const age of numericAges) {
                    if (age < plan.minAge || age > plan.maxAge) {
                        isPlanApplicable = false;
                        break;
                    }

                    const price = getPriceForAge(plan, age);

                    if (price === null) {
                        isPlanApplicable = false;
                        break;
                    }
                    dailyPriceSum += price;
                }

                if (isPlanApplicable) {
                    calculatedResults.push({
                        providerName: provider.providerName,
                        planId: plan.planId,
                        planName: plan.planName,
                        totalPrice: dailyPriceSum * days,
                        travelers,
                        days,
                        details: plan.details,
                    });
                }
            });
        });

        if (calculatedResults.length === 0 && !error) {
            setError('No se encontraron coberturas para los datos ingresados. Verificá las edades y las fechas del viaje.');
        }

        onQuote(calculatedResults);
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
            <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Cotizador de Seguros de Viaje</h1>
                <p className="text-gray-500 mt-2">Completá los datos para obtener una cotización al instante.</p>
            </div>

            <form onSubmit={handleQuoteSubmit} className="space-y-6">
                {/* --- FILA 1: FECHAS Y DURACIÓN --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Salida</label>
                        <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Regreso</label>
                        <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required />
                    </div>
                    {days > 0 && (
                        <div className="md:col-span-2 text-center text-gray-600 font-medium bg-gray-50 p-3 rounded-lg">
                            Duración del viaje: <span className="text-blue-600 font-bold">{days} días</span>
                        </div>
                    )}
                </div>

                {/* --- FILA 2: VIAJEROS Y EDADES --- */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="travelers" className="block text-sm font-medium text-gray-700 mb-1">Número de Viajeros</label>
                        <input type="number" id="travelers" value={travelers} onChange={handleTravelersChange} min="1" max="20" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Edades de los viajeros</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {ages.map((age, index) => (
                                <input
                                    key={index}
                                    type="number"
                                    value={age}
                                    onChange={(e) => handleAgeChange(index, e.target.value)}
                                    placeholder={`Viajero ${index + 1}`}
                                    min="0" max="100"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    required
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- BOTÓN DE COTIZAR --- */}
                <div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105">
                        Cotizar Ahora
                    </button>
                </div>
            </form>

            {error && <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">{error}</div>}
        </div>
    );
};

export default QuoteForm;


