export default function EstablishmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-brand-navy">Estabelecimentos</h1>
        <button className="px-4 py-2 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg hover:opacity-90 transition-opacity font-semibold">
          Novo Estabelecimento
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Nenhum estabelecimento cadastrado</p>
      </div>
    </div>
  );
}
