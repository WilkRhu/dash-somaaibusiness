export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-brand-navy">Clientes</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Nenhum cliente cadastrado</p>
      </div>
    </div>
  );
}
