// src/config/insuranceConfig.js

/**
 * Objeto de configuración centralizado para proveedores y planes de seguros.
 * Para agregar nuevas coberturas o proveedores, solo es necesario modificar este archivo.
 */
export const insuranceConfig = [
    {
        providerId: 'intermac',
        providerName: 'Intermac',
        plans: [
            {
                planId: 'intermac-i85',
                planName: 'Cobertura I85 / I100',
                rules: {
                    '0-75': 6.83,
                    '76-85': 16.27,
                },
                minAge: 0,
                maxAge: 85,
                minDays: 3,
                details: [
                    'Asistencia médica por accidente: USD 85,000',
                    'Asistencia médica por enfermedad: USD 85,000',
                    'Cancelación de viaje multicausa: USD 1,000',
                    'Pérdida de equipaje: USD 1,200',
                ]
            },
            {
                planId: 'intermac-economico',
                planName: 'Plan Económico',
                rules: {
                    '0-75': 5.50,
                },
                minAge: 0,
                maxAge: 75,
                minDays: 3,
                details: [
                    'Asistencia médica por accidente: USD 40,000',
                    'Asistencia médica por enfermedad: USD 40,000',
                    'Pérdida de equipaje: USD 900',
                ]
            },
            {
                planId: 'intermac-premium',
                planName: 'Plan Premium Plus',
                rules: {
                    '0-85': 20.00,
                },
                minAge: 0,
                maxAge: 85,
                minDays: 3,
                details: [
                    'Asistencia médica por accidente: USD 150,000',
                    'Asistencia médica por enfermedad: USD 150,000',
                    'Cancelación de viaje multicausa: USD 5,000',
                    'Pérdida de equipaje: USD 2,000',
                    'Cobertura para deportes extremos',
                ]
            },
        ],
    },
    // Futuros proveedores se pueden agregar aquí.
];

