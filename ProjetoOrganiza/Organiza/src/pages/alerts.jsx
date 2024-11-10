import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Modal from "react-modal";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [dataAlerta, setDataAlerta] = useState('');
  const [tipo, setTipo] = useState('');
  const [despesas, setDespesas] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const despesasSalvas = localStorage.getItem('despesas');
    if (despesasSalvas) {
      setDespesas(JSON.parse(despesasSalvas));
    }
  }, []);

  useEffect(() => {
    const checkLembretes = () => {
      const dataAtual = new Date();
      const lembretesProximos = despesas
        .filter(despesa => {
          const dataLembrete = new Date(despesa.dataAlerta);
          const diffDias = Math.ceil((dataLembrete - dataAtual) / (1000 * 60 * 60 * 24));
          return diffDias <= 5 && diffDias >= 0;
        })
        .map(despesa => ({
          descricao: despesa.descricao,
          data: despesa.dataAlerta
        }));

      console.log("Lembretes próximos:", lembretesProximos); // Log dos lembretes próximos

      if (lembretesProximos.length > 0) {
        Swal.fire({
          title: 'Lembretes Próximos da Data de Vencimento',
          html: lembretesProximos.map(d => `<p>${d.descricao} - ${d.data}</p>`).join(''),
          icon: 'warning',
          confirmButtonText: 'Ok'
        });
      }
    };

    // Executa a verificação ao montar o componente
    checkLembretes();

    // Configura o intervalo para verificar diariamente
    const interval = setInterval(checkLembretes, 24 * 60 * 60 * 1000); // 24 horas

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, [despesas]);

  function submitForm() {
    const novaDespesa = {
      descricao,
      dataAlerta,
      tipo
    };
    
    const novasDespesas = [...despesas, novaDespesa];
    setDespesas(novasDespesas);
    resetForm();

    // Salva as despesas no LocalStorage
    localStorage.setItem('despesas', JSON.stringify(novasDespesas));

    // Confirmação de sucesso
    Swal.fire({
      title: 'Sucesso',
      text: 'Lembrete criado com sucesso!',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
  }

  function editDespesa(index) {
    const despesa = despesas[index];
    setDescricao(despesa.descricao);
    setDataAlerta(despesa.dataAlerta);
    setTipo(despesa.tipo);
    setEditIndex(index);
    setIsOpen(true);
  }

  function saveEdit() {
    const despesaAtualizada = {
      descricao,
      dataAlerta,
      tipo
    };
    const novasDespesas = despesas.map((despesa, i) =>
      i === editIndex ? despesaAtualizada : despesa
    );
    setDespesas(novasDespesas);
    localStorage.setItem('despesas', JSON.stringify(novasDespesas));
    resetForm();

    Swal.fire({
      title: 'Atualizado!',
      text: 'Lembrete atualizado com sucesso!',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
  }

  function deleteDespesa(index) {
    const novasDespesas = despesas.filter((_, i) => i !== index);
    setDespesas(novasDespesas);
    localStorage.setItem('despesas', JSON.stringify(novasDespesas));

    Swal.fire({
      title: 'Excluído!',
      text: 'O lembrete foi excluído.',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
  }

  function resetForm() {
    setDescricao('');
    setDataAlerta('');
    setTipo('');
    setIsOpen(false);
    setEditIndex(null);
  }

  return (
    <main className="min-h-screen bg-neutral-200">
      <Modal
        isOpen={isOpen}
        overlayClassName="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-gray-700 bg-opacity-80"
        className="w-full max-w-lg bg-white p-6 relative outline-none rounded"
      >
        <button className="absolute right-4 top-4" onClick={resetForm}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-3xl mb-4">{editIndex !== null ? 'Editar Lembrete' : 'Criar Lembrete'}</h2>

        <label className="flex flex-col mb-2">
          Descrição
          <input
            className="py-2 px-3 outline-none border border-gray-300 mt-1 rounded"
            type="text"
            value={descricao}
            onChange={(ev) => setDescricao(ev.target.value)}
          />
        </label>

        <label className="flex flex-col mb-2">
          Data de Alerta
          <input
            className="py-2 px-3 outline-none border border-gray-300 mt-1 rounded"
            type="date"
            value={dataAlerta}
            onChange={(ev) => setDataAlerta(ev.target.value)}
          />
        </label>

        <label>Tipo</label>
        <div className="flex gap-4 mt-1">
          <button
            className={`flex-1 p-3 rounded ${tipo === 'Pagamento' ? 'bg-emerald-700' : 'bg-emerald-600'} text-white`}
            onClick={() => setTipo('Pagamento')}
          >
            Pagamento
          </button>
          <button
            className={`flex-1 p-3 rounded ${tipo === 'Resgate' ? 'bg-red-700' : 'bg-red-600'} text-white`}
            onClick={() => setTipo('Resgate')}
          >
            Resgate
          </button>
          <button
            className={`flex-1 p-3 rounded ${tipo === 'Outros' ? 'bg-blue-700' : 'bg-blue-600'} text-white`}
            onClick={() => setTipo('Outros')}
          >
            Outros
          </button>
        </div>

        <button
          className="p-3 bg-green-500 rounded text-white mt-4"
          onClick={editIndex !== null ? saveEdit : submitForm}
        >
          {editIndex !== null ? 'Salvar Alterações' : 'Criar Lembrete'}
        </button>
      </Modal>

      <section className="h-60 bg-emerald-600 pt-8">
        <div className="max-w-5xl mx-auto flex justify-between">
          <h1 className="text-white text-4xl font-semibold">Alertas & Lembretes</h1>
          <button
            className="flex items-center gap-2 rounded p-2 bg-emerald-500 text-white"
            onClick={() => setIsOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Novo Lembrete
          </button>
        </div>
      </section>

      <section className="max-w-5xl mx-auto">
        <table className="max-w-5xl w-full mt-10 border-separate border-spacing-1 border-spacing-x-0">
          <thead>
            <tr>
              <th className="px-3 py-4 text-left">Descrição</th>
              <th className="px-3 py-4 text-left">Data de Alerta</th>
              <th className="px-3 py-4 text-left">Tipo</th>
              <th className="px-3 py-4 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {despesas.map((item, index) => (
              <tr key={index}>
                <td className="text-gray-400 px-3 py-4 bg-white rounded-l-lg">{item.descricao}</td>
                <td className="text-gray-400 px-3 py-4 bg-white">{item.dataAlerta}</td>
                <td className="text-gray-400 px-3 py-4 bg-white font-semibold">
                  <span className={`px-3 py-1 rounded-lg ${item.tipo === 'Pagamento' ? 'bg-emerald-100 text-emerald-800' : item.tipo === 'Resgate' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                    {item.tipo}
                  </span>
                </td>
                <td className="text-gray-400 px-3 py-4 bg-white rounded-r-lg flex gap-2">
                  <button
                    className="bg-yellow-300 text-gray-800 p-2 rounded"
                    onClick={() => editDespesa(index)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white p-2 rounded"
                    onClick={() => deleteDespesa(index)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
