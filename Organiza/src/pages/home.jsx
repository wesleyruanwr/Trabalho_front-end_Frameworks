import Link from 'next/link'; // Importe o Link do Next.js
import { useRouter } from 'next/router'; // Importe o useRouter

export default function Index() {
  const router = useRouter(); // Inicializa o router

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

        <section className="bg-cover bg-center bg-no-repeat drop-shadow-2xl opacity-75" style={{ height: '40vh', backgroundImage: "url('/background-home.jpeg')" }}>
          <div className=" text-emerald-700 text-4xl text-shadow-2xl font-black p-10 text-center  "> 
             <br />
              Bem-vindo ao Organiza, o melhor site para gerir suas finanças!!!
          </div> 
        </section>  

        <section>
          <div className="flex flex-row-reverse justify-start items-center p-16 " >
            <span className="basis-1/2 text-4xl text-shadow-2xl font-bold animate-slideInRight" data-twe-animation-on-scroll="repeat" >
            Sua vida financeira na palma da mão de forma simples, fácil e segura.
            </span>
            <img src="/foto-mulher.webp" alt="imagem mulher no celular" className="basis-1/2 w-64 h-auto mr-8 animate-slideInLeft" data-twe-animation-on-scroll = "repeat" />
          </div>
        </section> 

        <section>
          <div className="flex flex-row justify-start items-center p-16 " >
            <span className="basis-1/2 text-4xl text-shadow-2xl font-bold animate-slideInRight" data-twe-animation-on-scroll="repeat" >
            Organização financeira para você e sua família.
            </span>
            <img src="/casal-rindo.webp" alt="imagem mulher no celular" className="basis-1/2 w-64 h-auto mr-8 animate-slideInLeft rounded-lg  " data-twe-animation-on-scroll = "repeat" />
          </div>
        </section>

        <section>
          <div className="flex flex-row-reverse justify-start items-center p-16 " >
            <span className="basis-1/2 text-4xl text-shadow-2xl font-bold animate-slideInRight" data-twe-animation-on-scroll="repeat" >
            Aqui você pode fazer aquela economia para sobrar dinheiro no fim do mês!
            </span>
            <img src="/porquinho-cofrinho.webp" alt="imagem mulher no celular" className="basis-1/2 w-64 h-auto mr-8 animate-slideInLeft" data-twe-animation-on-scroll = "repeat" />
          </div>
        </section> 

     
      </main>

      <footer></footer>
    </div>
  );
}