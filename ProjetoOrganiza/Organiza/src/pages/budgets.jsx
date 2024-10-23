import { useEffect, useState } from "react";
import Modal from "react-modal";
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Necessário para usar Chart.js

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [descricao, setDescricao] = useState(''); 
  const [tipo, setTipo] = useState('');
  const [valor, setValor] = useState(0);
  const [despesas, setDespesas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [goalValue, setGoalValue] = useState(0);
  const [editIndex, setEditIndex] = useState(null); // Para edição de despesas
  const [editGoalIndex, setEditGoalIndex] = useState(null); // Para edição de metas

  useEffect(() => {
    const despesasSalvas = localStorage.getItem('despesas');
    if (despesasSalvas) {
      setDespesas(JSON.parse(despesasSalvas));
    }
    
    const metasSalvas = localStorage.getItem('categorias');
    if (metasSalvas) {
      setCategorias(JSON.parse(metasSalvas));
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

  const submitForm = () => {
    const data = new Date().toLocaleDateString();
    const novaDespesa = {
      descricao,
      valor: parseFloat(valor),
      tipo,
      categoria,
      data 
    };

    if (editIndex !== null) {
      // Atualizar despesa existente
      const despesasAtualizadas = [...despesas];
      despesasAtualizadas[editIndex] = novaDespesa;
      setDespesas(despesasAtualizadas);
      localStorage.setItem('despesas', JSON.stringify(despesasAtualizadas));
    } else {
      // Adicionar nova despesa
      const novasDespesas = [...despesas, novaDespesa];
      setDespesas(novasDespesas);
      localStorage.setItem('despesas', JSON.stringify(novasDespesas));
    }
    
    resetForm();
  };

  const addGoal = () => {
    const novaCategoria = { nome: categoria, meta: goalValue };

    if (editGoalIndex !== null) {
      // Atualizar meta existente
      const categoriasAtualizadas = [...categorias];
      categoriasAtualizadas[editGoalIndex] = novaCategoria;
      setCategorias(categoriasAtualizadas);
      localStorage.setItem('categorias', JSON.stringify(categoriasAtualizadas));
    } else {
      // Adicionar nova meta
      const novasCategorias = [...categorias, novaCategoria];
      setCategorias(novasCategorias);
      localStorage.setItem('categorias', JSON.stringify(novasCategorias));
    }

    resetForm();
    setIsGoalModalOpen(false);
  };

  const resetForm = () => {
    setDescricao('');
    setValor(0);
    setTipo('');
    setCategoria('');
    setEditIndex(null); // Resetar o índice de edição
    setEditGoalIndex(null); // Resetar o índice de edição para metas
    setIsOpen(false);
  };

  const deleteExpense = (index) => {
    const despesasAtualizadas = despesas.filter((_, i) => i !== index);
    setDespesas(despesasAtualizadas);
    localStorage.setItem('despesas', JSON.stringify(despesasAtualizadas));
  };

  const deleteGoal = (index) => {
    const categoriasAtualizadas = categorias.filter((_, i) => i !== index);
    setCategorias(categoriasAtualizadas);
    localStorage.setItem('categorias', JSON.stringify(categoriasAtualizadas));
  };

  const editExpense = (index) => {
    const despesa = despesas[index];
    setDescricao(despesa.descricao);
    setValor(despesa.valor);
    setTipo(despesa.tipo);
    setCategoria(despesa.categoria);
    setEditIndex(index);
    setIsOpen(true);
  };

  const editGoal = (index) => {
    const meta = categorias[index];
    setCategoria(meta.nome);
    setGoalValue(meta.meta);
    setEditGoalIndex(index);
    setIsGoalModalOpen(true);
  };

  const data = {
    labels: categorias.map(cat => cat.nome),
    datasets: [
      {
        label: 'Orçamento Planejado',
        data: categorias.map(cat => cat.meta),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Gastos Reais',
        data: categorias.map(cat => {
          const totalGastos = despesas
            .filter(despesa => despesa.categoria === cat.nome)
            .reduce((acc, despesa) => acc + despesa.valor, 0);
          return totalGastos;
        }),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      }
    ]
  };

  return (
    <div className="flex min-h-screen bg-neutral-200">
      {/* Barra Lateral */}
      <aside className="w-64 bg-gradient-to-t from-emerald-600 via-emerald-500 to-emerald-400 text-white p-6 flex flex-col justify-between">
        <div>
          <div className="mb-10">
            {/* Logo */}
            <img src="/OrganizaLogoName.svg" alt="Logo" className="w-50 h-auto" />

          </div>
          <nav className="flex flex-col gap-4">
            <button className="flex items-center gap-4 rounded p-2 bg-emerald-700 text-white text-left p-3 rounded hover:bg-emerald-900">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>

              Receitas & Despesas
            </button>
            <button className="flex items-center gap-4 rounded p-2 bg-emerald-700 text-white text-left p-3 rounded hover:bg-emerald-900">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
            </svg>
              Orçamento
            </button>
            <button className="flex items-center gap-4 rounded p-2 bg-emerald-700 text-white text-left p-3 rounded hover:bg-emerald-900">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
              </svg>
              Investimentos
            </button>
            <button className="flex items-center gap-4 rounded p-2 bg-emerald-700 text-white text-left p-3 rounded hover:bg-emerald-900">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
              </svg>
              Configurações de Notificação
            </button>
          </nav>
        </div>
        <button className="flex items-center gap-12 rounded p-2 bg-red-700 text-white text-left p-2 rounded hover:bg-red-900">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
               <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
            </svg>
          Logout
        </button>
      </aside>
    <main className="flex-grow p-6">
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        className="w-full max-w-lg bg-white p-6 relative outline-none rounded"
      >
        {/* Modal para adicionar ou editar despesas */}
        <button 
          className="absolute right-4 top-4 text-gray-500 hover:text-red-500"
          onClick={() => resetForm()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>

        </button>
        <h2 className="text-3xl mb-4 text-gray-700">{editIndex !== null ? 'Editar Despesa' : 'Nova Despesa'}</h2>
        <label className="flex flex-col mb-2">
          Descrição
          <input 
            type="text"
            value={descricao}
            onChange={(ev) => setDescricao(ev.target.value)}
            className="border rounded p-2 mt-1"
          />
        </label>
        <label className="block text-gray-700">Tipo</label>
        <div className="flex gap-4 mt-1">
          <button 
            className={`p-2 rounded ${tipo === 'Diário' ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
            onClick={() => setTipo('Diário')}
          >
            Diário
          </button>
          <button 
            className={`p-2 rounded ${tipo === 'Semanal' ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
            onClick={() => setTipo('Semanal')}
          >
            Semanal
          </button>
          <button 
            className={`p-2 rounded ${tipo === 'Mensal' ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
            onClick={() => setTipo('Mensal')}
          >
            Mensal
          </button>
        </div>
        <label className="block text-gray-700 mt-4">Categoria</label>
        <input 
          type="text"
          value={categoria}
          onChange={(ev) => setCategoria(ev.target.value)}
          className="border rounded p-2 mt-1"
        />
        <label className="flex flex-col my-2">
          Valor
          <input 
            type="number" 
            value={valor}
            onChange={(ev) => setValor(ev.target.value)}
            className="border rounded p-2 mt-1"
          />
        </label>
        <button 
          className="bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600"
          onClick={submitForm}
        >
          {editIndex !== null ? 'Atualizar' : 'Salvar'}
        </button>
      </Modal>

      <Modal
        isOpen={isGoalModalOpen}
        onRequestClose={() => setIsGoalModalOpen(false)}
        className="w-full max-w-lg bg-white p-6 relative outline-none rounded"
      >
        {/* Modal para adicionar ou editar metas */}
        <button 
          className="absolute right-4 top-4 text-gray-500 hover:text-red-500"
          onClick={() => setIsGoalModalOpen(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>

        </button>
        <h2 className="text-3xl mb-4 text-gray-700">{editGoalIndex !== null ? 'Editar Meta de Orçamento' : 'Nova Meta de Orçamento'}</h2>
        <label className="block text-gray-700">Categoria</label>
        <input 
          type="text"
          value={categoria}
          onChange={(ev) => setCategoria(ev.target.value)}
          className="border rounded p-2 mt-1"
        />
        <label className="block text-gray-700 mt-4">Meta (Valor Máximo)</label>
        <input 
          type="number"
          value={goalValue}
          onChange={(ev) => setGoalValue(ev.target.value)}
          className="border rounded p-2 mt-1"
        />
        <button 
          className="bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600"
          onClick={addGoal}
        >
          {editGoalIndex !== null ? 'Atualizar Meta' : 'Adicionar Meta'}
        </button>
      </Modal>

      <section className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between mb-4">
          <button 
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
            onClick={() => setIsOpen(true)}
          >
            Adicionar Despesa
          </button>
          <button 
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            onClick={() => setIsGoalModalOpen(true)}
          >
            Definir Metas
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl text-gray-700 mb-4">Comparação entre Orçamento e Gastos</h2>
          <Bar data={data} />
        </div>

        {/* Exibir despesas */}
        <h2 className="text-2xl text-gray-700 mb-4">Despesas</h2>
        <ul>
          {despesas.map((despesa, index) => (
            <li key={index} className="bg-white p-4 rounded mb-4 flex justify-between items-center shadow-md">
              <div>
                <p><strong>Descrição:</strong> {despesa.descricao}</p>
                <p><strong>Categoria:</strong> {despesa.categoria}</p>
                <p><strong>Valor:</strong> R${despesa.valor}</p>
                <p><strong>Tipo:</strong> {despesa.tipo}</p>
                <p><strong>Data:</strong> {despesa.data}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                  onClick={() => editExpense(index)}
                >
                  Editar
                </button>
                <button 
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  onClick={() => deleteExpense(index)}
                >
                  Apagar
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Exibir metas */}
        <h2 className="text-2xl text-gray-700 mb-4">Metas de Orçamento</h2>
        <ul>
          {categorias.map((categoria, index) => (
            <li key={index} className="bg-white p-4 rounded mb-4 flex justify-between items-center shadow-md">
              <div>
                <p><strong>Categoria:</strong> {categoria.nome}</p>
                <p><strong>Meta:</strong> R${categoria.meta}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                  onClick={() => editGoal(index)}
                >
                  Editar
                </button>
                <button 
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  onClick={() => deleteGoal(index)}
                >
                  Apagar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
    </div>
  );
}
