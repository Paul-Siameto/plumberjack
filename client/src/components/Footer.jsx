export default function Footer() {
  return (
    <footer>
      <div className="footer-content" style={{maxWidth:1400,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'3rem'}}>
        <div>
          <div className="logo">ProPlumb Supply</div>
          <p>Your trusted partner for premium plumbing equipment.</p>
        </div>
        <div>
          <h4 style={{marginBottom:'1rem',color:'#fff'}}>Quick Links</h4>
          <ul style={{listStyle:'none'}}>
            <li><a href="#home">Home</a></li>
            <li><a href="#categories">Categories</a></li>
            <li><a href="#products">Products</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Shipping & Returns</a></li>
          </ul>
        </div>
        <div>
          <h4 style={{marginBottom:'1rem',color:'#fff'}}>Contact Us</h4>
          <p><i className="fas fa-phone"></i> +1 (555) 123-4567</p>
          <p><i className="fab fa-whatsapp"></i> WhatsApp: +1 (555) 987-6543</p>
          <p><i className="fas fa-envelope"></i> sales@proplumbsupply.com</p>
        </div>
        <div>
          <h4 style={{marginBottom:'1rem',color:'#fff'}}>Secure Payments</h4>
          <p>M-Pesa • Cards • Cash on Delivery</p>
        </div>
      </div>
      <div className="trust-badges">
        <i className="fas fa-lock" title="Secure Payments"></i>
        <i className="fas fa-truck" title="Fast Delivery"></i>
        <i className="fas fa-shield-alt" title="Verified Suppliers"></i>
        <i className="fas fa-credit-card" title="Multiple Payment Options"></i>
      </div>
      <p style={{textAlign:'center', marginTop:'2rem', opacity:0.8}}>&copy; 2026 ProPlumb Supply. All rights reserved.</p>
    </footer>
  )
}


