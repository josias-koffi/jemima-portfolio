export default function NotFound() {
  return (
    <section className="notfound wrap">
      <p className="label">Erreur 404</p>
      <h1>
        Oups, page <em>introuvable.</em>
      </h1>
      <p>
        <a className="btn btn--accent" href="/">
          Retour à l’accueil
        </a>
      </p>
    </section>
  )
}
