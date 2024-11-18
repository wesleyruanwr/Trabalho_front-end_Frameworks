import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter(); // Hook para redirecionamento

  const handleLogin = (e) => {
    e.preventDefault(); // Evita o comportamento padrão do formulário
    router.push('/home'); // Redireciona para a página "Início"
  };

  const handleRegister = () => {
    router.push('/cadastro'); // Redireciona para a página "Registre-se"
  };

  return (
    <div className="bg-[url('/bgimage.png')] bg-cover bg-center h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        {/* Logo */}
        <div className="w-1/2 pb-8 mx-auto text-center">
          <img
            src="/OrganizaLogoName2.svg"
            alt="Logo do Organiza"
            className="w-38 h-auto mx-auto"
          />
        </div>

        {/* Título */}
        <h1 className="text-black text-3xl font-semibold mb-6 text-center">
          Login
        </h1>

        {/* Formulário */}
        <form onSubmit={handleLogin}>
          {/* Campo Usuário */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-500 mb-2">
              Usuário
            </label>
            <input
              id="username"
              type="text"
              aria-label="Usuário"
              className="w-full p-2 rounded bg-gray-100 border border-gray-300 text-black focus:outline-none focus:ring focus:ring-emerald-500"
            />
          </div>

          {/* Campo Senha */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-500 mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              aria-label="Senha"
              className="w-full p-2 rounded bg-gray-100 border border-gray-300 text-black focus:outline-none focus:ring focus:ring-emerald-500"
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-1/2 bg-emerald-500 text-white py-2 rounded hover:bg-emerald-600 transition-colors">
              Login
            </button>
            <button
              type="button"
              onClick={handleRegister}
              className="w-1/2 bg-emerald-500 text-white py-2 rounded hover:bg-emerald-600 transition-colors">
              Registre-se
            </button>
          </div>
        </form>

        {/* Esqueceu a senha */}
        <div className="text-center mt-4">
          <a href="#" className="text-blue-500 hover:text-blue-400 transition-colors">
            Esqueceu a senha?
          </a>
        </div>
      </div>
    </div>
  );
}
