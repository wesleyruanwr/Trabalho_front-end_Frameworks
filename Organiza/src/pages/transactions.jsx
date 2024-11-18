import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useRouter } from 'next/router'; // Importe o useRouter
import Link from 'next/link'; // Importe o Link do Next.js

export default function Home() {
  const router = useRouter(); // Defina o useRouter para navegação
  const [isOpen, setIsOpen] = useState(false); 
  const [isEditMode, setIsEditMode] = useState(false); 
  const [descricao, setDescricao] = useState(''); 
  const [tipo, setTipo] = useState('');
  const [valor, setValor] = useState(0);
  const [despesas, setDespesas] = useState([]);
  const [editIndex, setEditIndex] = useState(null); 

  useEffect(() => {
    // Carrega as despesas do localStorage quando o componente monta
    const despesasSalvas = localStorage.getItem('despesas');
    if (despesasSalvas) {
        setDespesas(JSON.parse(despesasSalvas));
    }
  }, []);

  const summary = despesas.reduce((acc, despesa) => {
    if (despesa.tipo === 'Crédito') {
      acc.entradas += despesa.valor;
      acc.total += despesa.valor;
    } else {
      acc.saidas -= despesa.valor;
      acc.total -= despesa.valor;
    }

    return acc;
  }, {
    entradas: 0,
    saidas: 0,
    total: 0
  });

  function submitForm() {
    const data = new Date().toLocaleDateString();
    const novaDespesa = {
      descricao,
      valor: parseFloat(valor),
      tipo,
      data 
    };
    
    let novasDespesas;
    if (isEditMode) {
      novasDespesas = despesas.map((item, index) => 
        index === editIndex ? novaDespesa : item
      );
    } else {
      novasDespesas = [...despesas, novaDespesa];
    }

    setDespesas(novasDespesas);
    resetForm();

    // Salva as despesas no LocalStorage
    localStorage.setItem('despesas', JSON.stringify(novasDespesas));
  }

  function deleteDespesa(index) {
    const novasDespesas = despesas.filter((_, i) => i !== index);
    setDespesas(novasDespesas);

    // Salva as despesas no LocalStorage
    localStorage.setItem('despesas', JSON.stringify(novasDespesas));
  }

  function resetForm() {
    setDescricao('');
    setValor(0);
    setTipo('');
    setIsOpen(false);
    setIsEditMode(false);
    setEditIndex(null);
  }

  function openEditModal(index) {
    const despesa = despesas[index];
    setDescricao(despesa.descricao);
    setValor(despesa.valor);
    setTipo(despesa.tipo);
    setEditIndex(index);
    setIsEditMode(true);
    setIsOpen(true);
  }

  const handleNavigation = (href) => {
    router.push(href); // Função de navegação
  };

  return (
    <div className="flex min-h-screen">
      {/* Barra Lateral */}
      <aside className="w-64 bg-gradient-to-t from-emerald-600 via-emerald-500 to-emerald-400 text-white p-6 flex flex-col justify-between">
        <div>
          <div className="mb-10">
            {/* Logo */}
            <img src="/OrganizaLogoName.svg" alt="Logo" className="w-50 h-auto" />

          </div>
          <nav className="flex flex-col gap-4">

           <button
              onClick={() => handleNavigation('/home')}
              className="flex items-center gap-4 rounded p-3 bg-emerald-700 text-white text-left hover:bg-emerald-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                 <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>

              Página Principal
            </button>

            <button
              onClick={() => handleNavigation('/transactions')}
              className="flex items-center gap-4 rounded p-3 bg-emerald-700 text-white text-left hover:bg-emerald-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Receitas & Despesas
            </button>

            <button
              onClick={() => handleNavigation('/budgets')}
              className="flex items-center gap-4 rounded p-3 bg-emerald-700 text-white text-left hover:bg-emerald-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
              </svg>
              Orçamento
            </button>

            <button
              onClick={() => handleNavigation('/investimentos')}
              className="flex items-center gap-4 rounded p-3 bg-emerald-700 text-white text-left hover:bg-emerald-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
              </svg>
              Investimentos
            </button>

            <button
              onClick={() => handleNavigation('/alerts')}
              className="flex items-center gap-4 rounded p-3 bg-emerald-700 text-white text-left hover:bg-emerald-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0c-.586 2.006-2.12 3.375-3.571 3.375-1.45 0-2.985-1.369-3.571-3.375m7.142 0c-.286 0-.574.082-.857.238-.758.414-1.69.661-2.714.661-1.024 0-1.956-.247-2.714-.66a1.875 1.875 0 0 0-.857-.24" />
              </svg>
              Configurações de Notificação
            </button>
          </nav>
        </div>
        <button 
        onClick={() => handleNavigation('/login')}
        className="flex items-center gap-12 rounded p-2 bg-red-700 text-white text-left p-2 rounded hover:bg-red-900">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25V9M9 12v6m6-6v6M3 9h18m-2.25 0v9.75A2.25 2.25 0 0 1 16.5 21h-9a2.25 2.25 0 0 1-2.25-2.25V9" />
          </svg>
          Logout
        </button>
      </aside>

    <main className="w-screen bg-neutral-200">
      <Modal
        isOpen={isOpen}
        overlayClassName="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-gray-700 bg-opacity-80"
        className="w-full max-w-lg bg-white p-6 relative outline-none rounded"
      >
        <button 
          className="absolute right-4 top-4"
          onClick={() => resetForm()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-3xl mb-4">{isEditMode ? 'Editar Transação' : 'Criar nova Transação'}</h2>
        <label className="flex flex-col mb-2">
          Descrição
          <input 
            className="py-2 px-3 outline-none border border-gray-300 mt-1 rounded"
            type="text"
            list="descricao-sugestoes"
            value={descricao}
            onChange={(ev) => setDescricao(ev.target.value)}
          />
          <datalist id="descricao-sugestoes">
            <option value="Pagamento de aluguel" />
            <option value="Conta de luz" />
            <option value="Conta de água" />
            <option value="Compra de supermercado" />
            <option value="Abastecimento de veículo" />
            <option value="Mensalidade escolar" />
            <option value="Plano de saúde" />
            <option value="Pagamento de financiamento" />
            <option value="Compra de roupas" />
            <option value="Reserva para viagem" />
            <option value="Investimento mensal" />
            <option value="Assinatura de streaming" />
            <option value="Manutenção do carro" />
            <option value="Doação para caridade" />
            <option value="Presente de aniversário" />
            <option value="Reserva de emergência" />
            <option value="Seguro residencial" />
            <option value="IPVA/Imposto do veículo" />
            <option value="Consulta médica" />
          </datalist>
        </label>
        <label>Tipo</label>
        <div className="flex gap-4 mt-1">
          <button
            className={`flex-1 p-3 rounded ${tipo === 'Crédito' ? 'bg-emerald-700' : 'bg-emerald-600'} text-white`}
            onClick={() => setTipo('Crédito')}
          >
            Crédito
          </button>
          <button
            className={`flex-1 p-3 rounded ${tipo === 'Débito' ? 'bg-red-700' : 'bg-red-600'} text-white`}
            onClick={() => setTipo('Débito')}
          >
            Débito
          </button>
        </div>
        <label className="flex flex-col my-2">
          Valor
          <label className="flex py-2 px-3 outline-none border border-gray-300 mt-1 rounded">
            R$
            <input 
              type="text" 
              className="outline-none pl-2 w-full"
              value={valor}
              onChange={(ev) => setValor(ev.target.value)}
            />
          </label>
        </label>
        <button
          className="p-3 bg-green-500 rounded text-white mt-4"
          onClick={() => submitForm()}
        >
          {isEditMode ? 'Atualizar Transação' : 'Nova Transação'}
        </button>
      </Modal>
      <section className="h-60 bg-emerald-600 pt-8">
        <div className="max-w-5xl mx-auto flex justify-between">
          <h1 className="text-white text-4xl font-semibold">Receitas & Despesas</h1>
          <button
            className="flex items-center gap-2 rounded p-2 bg-emerald-500 text-white"
            onClick={() => setIsOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nova Transação
          </button>
        </div>
      </section> 
      <section className="max-w-5xl mx-auto">
        <div className="max-w-5xl mx-auto flex gap-5 h-[120px] -mt-[60px]">
          <div className="flex flex-col flex-1 bg-gray-100 rounded border-gray-300 shadow-md shadow-gray-300 p-3 justify-between">
            <div className="flex justify-between items-center">
              <h3 className="text-3xl text-emerald-700 font-semibold">Entradas</h3>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-9 text-emerald-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h1 className="text-3xl font-semibold">
              R$ {summary.entradas}
            </h1>
          </div>
          <div className="flex flex-col flex-1 bg-gray-100 rounded border-gray-300 shadow-md shadow-gray-300 p-3 justify-between">
            <div className="flex justify-between items-center">
              <h3 className="text-3xl text-red-700 font-semibold">Saídas</h3>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-9 text-red-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h1 className="text-3xl font-semibold">
              R$ {summary.saidas}
            </h1>
          </div>
          <div className="flex flex-col flex-1 bg-green-400 rounded border-gray-300 shadow-md shadow-gray-300 p-3 justify-between">
            <div className="flex justify-between items-center text-white">
              <h3 className="text-3xl font-semibold">Total</h3>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-9 text-yellow-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h1 className="text-white text-3xl font-semibold">
              R$ {summary.total}
            </h1>
          </div>
        </div>
        <table className="max-w-5xl w-full mt-10 border-separate border-spacing-1 border-spacing-x-0">
          <thead>
            <tr>
              <th className="px-3 py-4 text-left">Data</th>
              <th className="px-3 py-4 text-left">Descrição</th>
              <th className="px-3 py-4 text-left">Preço</th>
              <th className="px-3 py-4 text-left">Tipo</th>
              <th className="px-3 py-4 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {despesas.map((item, index) => {
              return (
                <tr key={index}>
                  <td className="text-gray-400 px-3 py-4 bg-white rounded-l-lg">{item.data}</td>
                  <td className="text-gray-400 px-3 py-4 bg-white">{item.descricao}</td>
                  <td className="text-gray-400 px-3 py-4 bg-white">R$ {item.valor}</td>
                  <td className={`text-gray-400 px-3 py-4 bg-white font-semibold ${item.tipo === 'Crédito' ? 'text-green-600' : 'text-red-600'}`}>
                     {item.tipo}
                  </td>
                  <td className="text-gray-400 px-3 py-4 bg-white rounded-r-lg">
                    <div className="flex gap-2">
                        <button
                          className="ml-2 text-blue-600 px-3 py-4 bg-white rounded-r-3xl flex items-center gap-2 hover:underline"
                          onClick={() => openEditModal(index)}                      
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                          </svg>
                          Editar
                        </button>
                        <button
                          className="ml-2 text-red-600 px-3 py-4 bg-white rounded-r-3xl flex items-center gap-2 hover:underline"
                          onClick={() => deleteDespesa(index)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                          Deletar
                        </button>
                    </div>
                  </td>
                </tr>  
              )
            })}            
          </tbody>
        </table>
      </section>   
    </main>
    </div>
  )
}
