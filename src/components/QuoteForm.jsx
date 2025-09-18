// src/components/QuoteForm.jsx
import { useState } from 'react';
import { insuranceConfig } from '/src/config/insuranceConfig.js';

/**
 * Componente QuoteForm:
 * Contiene el formulario para que el usuario ingrese los datos del viaje.
 * Se encarga de la validación y el cálculo de la cotización.
 */
const QuoteForm = ({ onQuote, onFormChange }) => {
    // --- State Management ---
    const [travelers, setTravelers] = useState(1);
    const [days, setDays] = useState(3);
    const [ages, setAges] = useState(['']);
    const [error, setError] = useState('');

    // --- Helper Functions ---

    /**
     * getPriceForAge: Busca el precio diario para un viajero según su edad en un plan específico.
     * @param {object} plan - El objeto del plan de seguro.
     * @param {number} age - La edad del viajero.
     * @returns {number|null} - El precio diario o null si no se encuentra una regla aplicable.
     */
    const getPriceForAge = (plan, age) => {
        // Itera sobre las claves del objeto de reglas (ej: '0-75', '76-85').
        for (const rangeKey in plan.rules) {
            const [min, max] = rangeKey.split('-').map(Number);
            if (age >= min && age <= max) {
                return plan.rules[rangeKey]; // Retorna el precio si la edad está en el rango.
            }
        }
        return null; // Si no se encuentra un rango de edad aplicable.
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

    const handleDaysChange = (e) => {
        setDays(parseInt(e.target.value, 10) || 3);
        onFormChange();
    }

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
        const numericAges = ages.map(age => parseInt(age, 10));
        if (numericAges.some(isNaN)) {
            setError('Por favor, complete la edad de todos los viajeros.');
            return;
        }

        // --- Lógica de cálculo ---
        const calculatedResults = [];

        insuranceConfig.forEach(provider => {
            provider.plans.forEach(plan => {
                // Valida que el plan sea aplicable según los días de viaje.
                if (days < plan.minDays) return;

                let dailyPriceSum = 0;
                let isPlanApplicable = true;

                for (const age of numericAges) {
                    // Valida que la edad esté dentro de los límites del plan.
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

        if (calculatedResults.length === 0) {
            setError('No se encontraron coberturas para los datos ingresados. Verifique las edades y la duración del viaje.');
        }

        onQuote(calculatedResults);
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
            <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Cotizador de Seguros de Viaje</h1>
                <p className="text-gray-500 mt-2">Completa los datos para obtener una cotización al instante.</p>
            </div>

            <form onSubmit={handleQuoteSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="travelers" className="block text-sm font-medium text-gray-700 mb-1">Número de Viajeros</label>
                        <input type="number" id="travelers" value={travelers} onChange={handleTravelersChange} min="1" max="20" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required />
                    </div>
                    <div>
                        <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-1">Días de Viaje</label>
                        <input type="number" id="days" value={days} onChange={handleDaysChange} min="1" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required />
                    </div>
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

