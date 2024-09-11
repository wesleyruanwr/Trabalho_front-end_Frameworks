import { useEffect, useState } from "react";
import Modal from "react-modal";

export default function Home() {
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

  return (
    <main className="min-h-screen bg-neutral-200">
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
            value={descricao}
            onChange={(ev) => setDescricao(ev.target.value)}
          />
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
  )
}
