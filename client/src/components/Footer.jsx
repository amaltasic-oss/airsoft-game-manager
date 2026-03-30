function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span>Airsoft Game Manager</span>

        <span className="footer-separator">•</span>

        <span>Created by SOTII</span>

        <span className="footer-separator">•</span>

        <span>{new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}

export default Footer;