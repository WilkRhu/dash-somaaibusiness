export default function OffersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-brand-navy">Ofertas</h1>
        <button className="px-4 py-2 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg hover:opacity-90 transition-opacity font-semibold">
          Nova Oferta
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Nenhuma oferta cadastrada</p>
      </div>
    </div>
  );
}
