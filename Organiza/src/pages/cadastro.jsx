import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

export default function RegisPage() {
  const router = useRouter();

  // Função para redirecionar para a tela de login
  const handleGoBack = () => {
    router.push('/login'); // Substitua '/login' pela rota correta da sua página de login
  };

  // Função para exibir o SweetAlert2 ao finalizar o cadastro
  const handleSubmit = (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    Swal.fire({
      title: "Cadastro concluído!",
      text: "Agora você já pode organizar suas finanças com o Organiza!😎.",
      imageUrl: "\checkimage.gif",
      imageWidth:80,
      imageHeight: 80,
      imageAlt: "Custom GIF"
    }).then(() => {
      // Opcional: Redireciona para a tela de login após fechar o modal
      router.push('/login'); // Substitua '/login' pela sua rota de login
    });
  };

  return (
    <div className="bg-[url('/bgimage.png')] bg-cover bg-center h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      
        {/* Botão de Voltar */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleGoBack}
            className="p-2 rounded-full bg-emerald-600 hover:bg-emerald-700 transition-colors"
          >
            <svg
              className="w-5 h-5 text-white mx-auto rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
            <span className="sr-only">Voltar</span>
          </button>
        </div>

        {/* Título da Página */}
        <h1 className="text-black text-3xl font-semibold mb-8 text-center">Cadastro</h1>

        {/* Formulário de Cadastro */}
        <form onSubmit={handleSubmit}>
          
          {/* Campo de Usuário */}
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Usuário</label>
            <input
              type="text"
              className="w-full p-3 rounded-md bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Campo de E-mail */}
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">E-mail</label>
            <input
              type="email"
              className="w-full p-3 rounded-md bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Campo de Senha */}
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Senha</label>
            <input
              type="password"
              className="w-full p-3 rounded-md bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Campo de Confirmação de Senha */}
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Confirme a senha</label>
            <input
              type="password"
              className="w-full p-3 rounded-md bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Botão de Enviar Cadastro */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 rounded-md hover:bg-emerald-700 transition-colors"
            >
              Finalizar cadastro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
