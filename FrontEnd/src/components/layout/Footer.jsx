import { Link } from 'react-router-dom';
import { LOGO_URL } from '../../lib/constants';

function Footer() {
  return (
    <footer className="bg-gray-100 py-10 px-6 md:px-20 text-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img
              src="img/logo.png"
              
              className="w-10 h-10"
            />
            {/* <h2 className="text-xl font-bold text-amber-700">LuxeHome</h2> */}
          </div>
          <p className="text-gray-600">
            Elevating your space with timeless furniture and elegant designs.
          </p>
        </div>

        <div>
          <h5 className="font-bold mb-3 text-lg">Services</h5>
          <ul className="space-y-2 text-gray-600">
            <li>Furniture Inventory Management</li>
            <li>Sales & Billing System</li>
            <li>Order & Delivery Tracking</li>
            <li>Reports & Analytics</li>
            <li>Admin Dashboard</li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold mb-3 text-lg">Contact Us</h5>
          <div className="space-y-2 text-gray-600">
            <p>📞 +880-1234-567890</p>
            <p>📧 support@luxehome.com</p>
          </div>
          <div className="flex gap-4 mt-4">
            <a href="#" className="text-gray-600 hover:text-amber-700 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="text-center mt-10 pt-6 border-t border-gray-300 text-sm text-gray-600">
        ©2025 LuxeHome. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
