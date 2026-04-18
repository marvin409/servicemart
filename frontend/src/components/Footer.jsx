function Footer({ labels }) {
  return (
    <footer className="site-footer">
      <p>{labels.footerDeveloper}</p>
      <a href="https://instagram.com/nai.raw.b3rry" target="_blank" rel="noreferrer">
        {labels.footerInstagram}
      </a>
    </footer>
  );
}

export default Footer;
