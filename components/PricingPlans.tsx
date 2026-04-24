'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PlanInfo {
  id: string;
  name: string;
  price: number | null;
  priceText: string;
  interval?: string;
  features: string[];
  recommended?: boolean;
  contactSales?: boolean;
}

const PLANS: PlanInfo[] = [
  {
    id: 'basic',
    name: 'Business Básico',
    price: 49.90,
    priceText: 'R$ 49,90',
    interval: '/mês',
    features: [
      'Até 100 produtos',
      '2 usuários',
      '1 estabelecimento',
      'Relatórios básicos',
    ],
  },
  {
    id: 'premium',
    name: 'Business Premium',
    price: 149.90,
    priceText: 'R$ 149,90',
    interval: '/mês',
    recommended: true,
    features: [
      'Até 1000 produtos',
      '5 usuários',
      '3 estabelecimentos',
      'Relatórios avançados',
      'Programa de fidelidade',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: null,
    priceText: 'Sob consulta',
    contactSales: true,
    features: [
      'Produtos ilimitados',
      'Usuários ilimitados',
      'Estabelecimentos ilimitados',
      'Todos os recursos',
      'Suporte prioritário',
      'API Access',
    ],
  },
];

export default function PricingPlans() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {PLANS.map((plan) => {
        const isPopular = plan.recommended;

        return (
          <div
            key={plan.id}
            className={`relative rounded-xl shadow-lg p-8 ${
              isPopular
                ? 'bg-gradient-to-br from-brand-blue to-brand-green text-white transform scale-105'
                : 'bg-white border-2 border-gray-200 hover:border-brand-blue transition-colors'
            }`}
          >
            {isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-navy text-white text-sm font-semibold px-4 py-1 rounded-full shadow-lg">
                MAIS POPULAR
              </div>
            )}

            <h4 className={`text-2xl font-bold mb-2 ${!isPopular ? 'text-brand-navy' : ''}`}>
              {plan.name}
            </h4>

            <div className={`text-4xl font-bold mb-6 ${!isPopular ? 'text-brand-blue' : ''}`}>
              {plan.priceText}<span className={`text-lg ${isPopular ? 'opacity-90' : 'text-brand-navy/70'}`}>{plan.interval || ''}</span>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className={`text-xl ${isPopular ? '' : 'text-brand-green'}`}>✓</span>
                  <span className={isPopular ? 'opacity-90' : 'text-brand-navy/70'}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href={plan.contactSales ? '/contact-sales' : '/register'}
              className={`block w-full px-6 py-3 text-center rounded-lg font-semibold transition-colors ${
                isPopular
                  ? 'bg-white text-brand-blue hover:bg-gray-50'
                  : 'border-2 border-brand-blue text-brand-navy hover:bg-brand-blue/5'
              }`}
            >
              {plan.contactSales ? 'Solicitar Orçamento' : 'Começar'}
            </Link>
          </div>
        );
      })}
    </div>
  );
}