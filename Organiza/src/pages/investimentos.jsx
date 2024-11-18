import { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import Modal from "react-modal";
import Link from 'next/link'; // Importe o Link do Next.js
import { useRouter } from 'next/router'; // Importe o useRouter

export default function Budgets() {
  const router = useRouter(); // Inicializa o router

  const [isOpen, setIsOpen] = useState(false); 
  const [isEditMode, setIsEditMode] = useState(false); 
  const [instituicao, setInstituicao] = useState(''); 
  const [tipo, setTipo] = useState('');
  const [rendimento, setRendimento] = useState(''); 
  const [datavencimento, setDataVencimento] = useState('');
  const [valor, setValor] = useState(0);
  const [despesas, setDespesas] = useState([]);
  const [editIndex, setEditIndex] = useState(null); 

  useEffect(() => {
    const despesasSalvas = localStorage.getItem('despesas');
    if (despesasSalvas) {
        setDespesas(JSON.parse(despesasSalvas));
    }
  }, []);

  const summary = despesas.reduce((acc, despesa) => {
    acc.entradas += 1;
    acc.total += despesa.valor;
    const mesesInvestidos = calcularMesesInvestidos(despesa.datavencimento);
    acc.saidas += calcularRendimento(despesa.valor, despesa.rendimento, mesesInvestidos);
    return acc;
  }, {
    entradas: 0,
    saidas: 0,
    total: 0
  });

  function calcularRendimento(valorInicial, rendimentoMensal, meses) {
    if (isNaN(valorInicial) || isNaN(rendimentoMensal) || isNaN(meses)) {
      return 0;
    }
    const rendimentoDecimal = rendimentoMensal / 100;
    return valorInicial * Math.pow(1 + rendimentoDecimal, meses);
  }

  function calcularMesesInvestidos(dataVencimento) {
    const dataAtual = new Date();
    const dataFinal = new Date(dataVencimento.split('/').reverse().join('-'));
    const mesesInvestidos = (dataFinal.getFullYear() - dataAtual.getFullYear()) * 12 + (dataFinal.getMonth() - dataAtual.getMonth());
    return mesesInvestidos < 0 ? 0 : mesesInvestidos;
  }

  function submitForm() {
    const meses = calcularMesesInvestidos(datavencimento);
    const rendimentoEstimado = calcularRendimento(
      parseFloat(valor),
      parseFloat(rendimento),
      meses
    );

    const novaDespesa = {
      instituicao,
      valor: parseFloat(valor),
      tipo,
      rendimento: parseFloat(rendimento),
      datavencimento,
      data: new Date().toLocaleDateString(),
      rendimentoEstimado: rendimentoEstimado.toFixed(2)
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
    localStorage.setItem("despesas", JSON.stringify(novasDespesas));
  }

  function deleteDespesa(index) {
    const novasDespesas = despesas.filter((_, i) => i !== index);
    setDespesas(novasDespesas);
    localStorage.setItem('despesas', JSON.stringify(novasDespesas));
  }

  function resetForm() {
    setInstituicao('');
    setValor(0);
    setTipo('');
    setRendimento('');
    setIsOpen(false);
    setIsEditMode(false);
    setEditIndex(null);
  }

  function openEditModal(index) {
    const despesa = despesas[index];
    setInstituicao(despesa.instituicao);
    setValor(despesa.valor);
    setTipo(despesa.tipo);
    setRendimento(despesa.rendimento);
    setEditIndex(index);
    setIsEditMode(true);
    setIsOpen(true);
  }

  // Função para navegação
  const handleNavigation = (href) => {
    router.push(href);
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

    {/* Conteúdo Principal */}
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
        <h2 className="text-3xl mb-4">{isEditMode ? 'Editar Investimento' : 'Criar novo investimento'}</h2>
        <label className="flex flex-col mb-2">
          Instituição
          <input 
            className="py-2 px-3 outline-none border border-gray-300 mt-1 rounded"
            type="text"
            list="descricao-sugestoes"
            value={instituicao}
            onChange={(ev) => setInstituicao(ev.target.value)}
          />
          <datalist id="descricao-sugestoes">
          <option value="Banco do Brasil" />
          <option value="Caixa Econômica Federal" />
          <option value="Itaú" />
          <option value="Bradesco" />
          <option value="Santander" />
          <option value="Nubank" />
          <option value="Banco Inter" />
          <option value="C6 Bank" />
          </datalist>
        </label>
        <label>Tipo</label>
        <div className="flex gap-4 mt-1">
          <input 
            className="py-2 px-3 outline-none border border-gray-300 mt-1 rounded"
            type="text"
            list="descricao-sugestoes2"
            value={tipo}
            onChange={(ev) => setTipo(ev.target.value)}
          />
          <datalist id="descricao-sugestoes2">
          <option value="Poupança" />
          <option value="CDB (Certificado de Depósito Bancário)" />
          <option value="LCI (Letra de Crédito Imobiliário)" />
          <option value="LCA (Letra de Crédito do Agronegócio)" />
          <option value="Fundos de Investimento" />
          <option value="Tesouro Direto" />
          <option value="Ações" />
          <option value="Debêntures" />
          <option value="Previdência Privada" />
          <option value="COE (Certificado de Operações Estruturadas)" />
          </datalist>
        </div>

        <label className="flex flex-col my-2">
          Rendimento (% mensal)
          <label className="flex py-2 px-3 outline-none border border-gray-300 mt-1 rounded">
            <input 
              type= "text"
              className="outline-none pl-2 w-full"
              value={rendimento}
              onChange={(ev) => setRendimento(ev.target.value)}
            />
            <span className="text-gray-500">%</span>
          </label>
        </label>

        <label>Data de Vencimento</label>
        <div className="flex gap-4 mt-1">
          <Flatpickr
            className="py-2 px-3 outline-none border border-gray-300 mt-1 rounded"
            value={datavencimento ? new Date(datavencimento.split('/').reverse().join('-')) : null}
            onChange={(date) => {
              setDataVencimento(date[0].toLocaleDateString("pt-BR"));
            }}
            options={{
              dateFormat: "d/m/Y",
            }}
            placeholder="DD/MM/AAAA"
          />
        </div>

        <label className="flex flex-col my-2">
          Valor
          <label className="flex py-2 px-3 outline-none border border-gray-300 mt-1 rounded">
            R$
            <input 
              type= "text"
              className="outline-none pl-2 w-full"
              value={valor}
              onChange={(ev) => setValor(Number(ev.target.value))}
            />
          </label>
        </label>
        <button
          className="p-3 bg-green-500 rounded text-white mt-4"
          onClick={() => submitForm()}
        >
          {isEditMode ? 'Atualizar Investimento' : 'Novo Investimento'}
        </button>
      </Modal>
      <section className="h-60 bg-emerald-600 pt-8">
        <div className="max-w-5xl mx-auto flex justify-between">
          <h1 className="text-white text-4xl font-semibold">Investimentos</h1>
          <button
            className="flex items-center gap-2 rounded p-2 bg-emerald-500 text-white"
            onClick={() => setIsOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Novo Investimento
          </button>
        </div>
      </section> 
      <section className="max-w-5xl mx-auto">
  <div className="max-w-5xl mx-auto flex gap-5 h-[120px] -mt-[60px]">
    <div className="flex flex-col flex-1 bg-gray-100 rounded border-gray-300 shadow-md shadow-gray-300 p-3 justify-between">
      <div className="flex justify-between items-center">
        <h2 className="text-gray-500">Total Investido</h2>
        <span className="text-3xl font-semibold">R$ {summary.total.toFixed(2)}</span>
      </div>
    </div>
    <div className="flex flex-col flex-1 bg-gray-100 rounded border-gray-300 shadow-md shadow-gray-300 p-3 justify-between">
      <div className="flex justify-between items-center">
        <h2 className="text-gray-500">Rendimento Estimado</h2>
        <span className="text-3xl font-semibold">R$ {summary.saidas.toFixed(2)}</span>
      </div>
    </div>
  </div>
</section>

      <section className="max-w-5xl mx-auto mt-6">
        {despesas.length === 0 ? (
          <p className="text-center text-gray-500">Nenhum investimento cadastrado.</p>
        ) : (
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-4 font-medium">Instituição</th>
                <th className="text-left p-4 font-medium">Tipo</th>
                <th className="text-left p-4 font-medium">Rendimento (%)</th>
                <th className="text-left p-4 font-medium">Valor (R$)</th>
                <th className="text-left p-4 font-medium">Data de Vencimento</th>
                <th className="text-left p-4 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {despesas.map((despesa, index) => (
                <tr key={index} className="border-t">
                  <td className="p-4">{despesa.instituicao}</td>
                  <td className="p-4">{despesa.tipo}</td>
                  <td className="p-4">{despesa.rendimento}%</td>
                  <td className="p-4">R$ {despesa.valor.toFixed(2)}</td>
                  <td className="p-4">{despesa.datavencimento}</td>
                  <td className="p-4">
                    <button
                      className="text-blue-500 mr-4"
                      onClick={() => openEditModal(index)}
                    >
                      Editar
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => deleteDespesa(index)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  </div>  
  );
}