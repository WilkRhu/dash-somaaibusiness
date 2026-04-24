import React from 'react';
import { render, screen } from '@testing-library/react';
import { MetricCard } from '@/components/fiscal/metric-card';

describe('MetricCard', () => {
  it('should render metric card with title and value', () => {
    render(
      <MetricCard
        title="Total de Notas"
        value={100}
        icon="📄"
        color="blue"
      />
    );

    expect(screen.getByText('Total de Notas')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('📄')).toBeInTheDocument();
  });

  it('should render subtitle when provided', () => {
    render(
      <MetricCard
        title="Taxa de Sucesso"
        value="95%"
        icon="✅"
        color="green"
        subtitle="Notas autorizadas"
      />
    );

    expect(screen.getByText('Notas autorizadas')).toBeInTheDocument();
  });

  it('should render trend when provided', () => {
    render(
      <MetricCard
        title="Emissões"
        value={50}
        icon="📊"
        color="blue"
        trend={{ value: 15, direction: 'up' }}
      />
    );

    expect(screen.getByText('15% vs período anterior')).toBeInTheDocument();
  });

  it('should apply correct color classes', () => {
    const { container } = render(
      <MetricCard
        title="Test"
        value={10}
        icon="🔔"
        color="red"
      />
    );

    expect(container.firstChild).toHaveClass('bg-red-50');
    expect(container.firstChild).toHaveClass('border-red-200');
  });
});
