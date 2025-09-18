import { useState } from 'react';

// Pequeño componente para el ícono de la tarjeta
const ShieldCheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 inline-block text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


function App() {
    // --- State Management ---
    const [travelers, setTravelers] = useState(1);
    const [days, setDays] = useState(3);
    const [ages, setAges] = useState(['']);
    const [quote, setQuote] = useState(null);
    const [error, setError] = useState('');

    // --- Event Handlers ---
    const handleTravelersChange = (e) => {
        let count = parseInt(e.target.value, 10);
        if (isNaN(count) || count < 1) {
            count = 1;
        }
        if (count > 20) {
            setError('Para grupos mayores a 20 personas, por favor contáctanos.');
            count = 20;
        } else {
            setError('');
        }
        setTravelers(count);
        setAges(new Array(count).fill(''));
    };

    const handleAgeChange = (index, value) => {
        const newAges = [...ages];
        newAges[index] = value;
        setAges(newAges);
    };

    const handleQuote = (e) => {
        e.preventDefault();
        setError('');
        setQuote(null);

        // --- Reglas de negocio ---
        const price_0_75 = 6.83;
        const price_76_85 = 16.27;
        const minDays = 3;

        // --- Validaciones ---
        if (days < minDays) {
            setError(`El viaje debe ser de un mínimo de ${minDays} días.`);
            return;
        }

        const numericAges = ages.map(age => parseInt(age, 10));

        if (numericAges.some(isNaN)) {
            setError('Por favor, complete la edad de todos los viajeros.');
            return;
        }

        if (numericAges.some(age => age < 0 || age > 85)) {
            setError('Las edades deben estar entre 0 y 85 años para este plan.');
            return;
        }

        // --- Calcular el precio total ---
        let totalPrice = 0;
        numericAges.forEach(age => {
            if (age >= 0 && age <= 75) {
                totalPrice += price_0_75;
            } else if (age >= 76 && age <= 85) {
                totalPrice += price_76_85;
            }
        });

        const finalPrice = totalPrice * days;
        setQuote(finalPrice);

        // Scroll suave a los resultados
        setTimeout(() => {
            document.getElementById('results-container')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    // --- Renderizado ---
    return (
        <div className="bg-gray-100 flex flex-col items-center justify-center min-h-screen p-4 font-sans">
            <main className="w-full max-w-4xl mx-auto">
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Cotizador de Seguros de Viaje</h1>
                        <p className="text-gray-500 mt-2">Completa los datos para obtener una cotización al instante.</p>
                    </div>

                    <form onSubmit={handleQuote} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="travelers" className="block text-sm font-medium text-gray-700 mb-1">Número de Viajeros</label>
                                <input type="number" id="travelers" value={travelers} onChange={handleTravelersChange} min="1" max="20" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required />
                            </div>
                            <div>
                                <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-1">Días de Viaje</label>
                                <input type="number" id="days" value={days} onChange={(e) => setDays(parseInt(e.target.value, 10) || 3)} min="3" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required />
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
                                        min="0" max="85"
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

                    {error && <div className="mt-4 text-center text-red-600 font-medium">{error}</div>}
                </div>

                {quote !== null && (
                    <div id="results-container" className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
                         <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-blue-600 transform scale-105">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center"><ShieldCheckIcon /> Intermac</h3>
                            <p className="text-sm text-gray-500 mb-4 ml-8">Cobertura I85 / I100</p>
                            <div className="my-6 text-center">
                                <span className="text-5xl font-extrabold text-gray-900">
                                    {quote.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                </span>
                                <span className="text-base font-medium text-gray-500"> USD</span>
                            </div>
                            <p className="text-center text-gray-600 text-sm mb-6">Precio total por {travelers} viajero(s) durante {days} días.</p>
                            <a href="https://cuanto.app/viajaconpri" target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition">
                                Contratar Seguro
                            </a>
                        </div>
                        {/* Aquí puedes añadir las otras tarjetas como componentes si lo deseas */}
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
