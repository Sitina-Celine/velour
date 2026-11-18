export default function Header() {
  return (
    <header className="header">
      <a className="logo" href="/">VELOUR</a>
      <nav className="header-nav" aria-label="Page">
        <a href="#looks">Looks</a>
        <a href="#build">Build your trio</a>
      </nav>
      <a className="btn btn-small" href="#build">Shop</a>
    </header>
  );
}
