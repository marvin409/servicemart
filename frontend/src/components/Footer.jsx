function Footer({ labels }) {
  return (
    <footer className="site-footer">
      <div className="footer-contact">
        <p>{labels.footerDeveloper}</p>
        <p>{labels.footerPhone || "Mobile: 0791019946"}</p>
      </div>
      <a href="https://instagram.com/nyalia.ke" target="_blank" rel="noreferrer">
        {labels.footerInstagram}
      </a>
    </footer>
  );
}

export default Footer;
