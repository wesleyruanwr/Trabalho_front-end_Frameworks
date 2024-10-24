import { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import Modal from "react-modal";

export default function Budgets() {
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
        <h2 className="text-3xl mb-4">{isEditMode ? 'Editar Investimento' : 'Criar novo investimento'}</h2>
        <label className="flex flex-col mb-2">
          Instituição
          <input 
            className="py-2 px-3 outline-none border border-gray-300 mt-1 rounded"
            type="text"
            value={instituicao}
            onChange={(ev) => setInstituicao(ev.target.value)}
          />
        </label>
        <label>Tipo</label>
        <div className="flex gap-4 mt-1">
          <input 
            className="py-2 px-3 outline-none border border-gray-300 mt-1 rounded"
            type="text"
            value={tipo}
            onChange={(ev) => setTipo(ev.target.value)}
          />
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
  );
}
