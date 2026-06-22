import Button from '../../components/ui/Button.jsx';

function Home() {
  return (
    <section className="page">
      <div className="page-header">
        <p className="eyebrow">Projeto React</p>
        <h1>CNH Facil</h1>
        <p>Estrutura inicial com rotas, componentes reutilizaveis e estilos globais.</p>
      </div>

      <Button>Comecar</Button>
    </section>
  );
}

export default Home;
