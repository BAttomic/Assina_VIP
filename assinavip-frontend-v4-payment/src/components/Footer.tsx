import { Facebook, Instagram, Music2, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <h3>cyber</h3>
          <p>We are a residential interior design firm located in Portland. Our boutique-studio offers more than.</p>
          <div className="socials">
            <Twitter size={14} />
            <Facebook size={14} />
            <Music2 size={14} />
            <Instagram size={14} />
          </div>
        </div>
        <div>
          <h4>Services</h4>
          <a href="#">Bonus program</a><a href="#">Gift cards</a><a href="#">Credit and payment</a><a href="#">Service contracts</a><a href="#">Non-cash account</a><a href="#">Payment</a>
        </div>
        <div>
          <h4>Assistance to the buyer</h4>
          <a href="#">Find an order</a><a href="#">Terms of delivery</a><a href="#">Exchange and return of goods</a><a href="#">Guarantee</a><a href="#">Frequently asked questions</a><a href="#">Terms of use of the site</a>
        </div>
      </div>
    </footer>
  );
}
