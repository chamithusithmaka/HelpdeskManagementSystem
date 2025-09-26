import React, { useEffect, useState } from 'react';
import { FaBook, FaCartPlus, FaReceipt, FaCreditCard, FaListAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Header from '../../Common/Header'; // <-- Import Header
import './BookList.css';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Payment fields
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiry, setExpiry] = useState('');
  const [orderMsg, setOrderMsg] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/orders/books');
      if (!response.ok) throw new Error('Failed to fetch books');
      const data = await response.json();
      setBooks(data.data);
    } catch (err) {
      setError('Could not load books.');
    } finally {
      setLoading(false);
    }
  };

  // Add one more of this book to cart, up to book.quantity
  const handleAddToCart = (book) => {
    setCart((prev) => {
      const currentQty = prev[book._id] || 0;
      if (currentQty < book.quantity) {
        return { ...prev, [book._id]: currentQty + 1 };
      }
      return prev;
    });
  };

  // Calculate order summary
  const cartBooks = books.filter((book) => cart[book._id]);
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = cartBooks.reduce(
    (sum, book) => sum + book.price * cart[book._id],
    0
  );

  // Simple validation for card fields
  const validateCard = () => {
    const cardRegex = /^\d{16}$/;
    const cvvRegex = /^\d{3,4}$/;
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return (
      cardRegex.test(cardNumber.replace(/\s/g, '')) &&
      cvvRegex.test(cvv) &&
      expiryRegex.test(expiry)
    );
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setOrderMsg('');
    if (!validateCard()) {
      setOrderMsg('Please enter valid card details.');
      return;
    }
    if (cartBooks.length === 0) {
      setOrderMsg('Your cart is empty.');
      return;
    }

    // Get actual logged-in user
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      setOrderMsg('You must be logged in to place an order.');
      return;
    }

    const orderData = {
      items: cartBooks.map(book => ({
        bookId: book._id,
        quantity: cart[book._id]
      })),
      userid: user._id,
      username: user.full_name,
      cardNumber: cardNumber.replace(/\s/g, ''),
      cvv,
      expiry
    };

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setOrderMsg('Order placed successfully!');
        setCart({});
        setCardNumber('');
        setCvv('');
        setExpiry('');
        fetchBooks(); // <-- Refresh book list after order
      } else {
        setOrderMsg(data.message || 'Order failed.');
      }
    } catch (err) {
      setOrderMsg('Order failed. Please try again.');
    }
  };

  return (
    <div className="booklist-bg">
      <Header /> {/* Use the new header at the top */}
      
      <main className="booklist-main">
        {/* Place the My Orders button here, above the book grid */}
        <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto 18px auto', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="myorders-btn"
            onClick={() => navigate('/my-orders')}
          >
            <FaListAlt style={{ marginRight: 6 }} />
            My Orders
          </button>
        </div>
        <div className="book-dashboard-flex">
          <div className="book-dashboard-main">
            {loading ? (
              <div className="booklist-loading">Loading books...</div>
            ) : error ? (
              <div className="booklist-error">{error}</div>
            ) : (
              <div className="booklist-grid">
                {books.length === 0 ? (
                  <div className="booklist-empty">No books available.</div>
                ) :
                  books.map((book) => {
                    const cartQty = cart[book._id] || 0;
                    const maxed = cartQty >= book.quantity;
                    return (
                      <div className="book-card" key={book._id}>
                        <div className="book-card-header">
                          <span className="book-card-name">{book.itemName}</span>
                        </div>
                        <div className="book-card-body">
                          <div>
                            <span className="book-card-label">Quantity:</span> {book.quantity}
                          </div>
                          <div>
                            <span className="book-card-label">Price:</span> Rs. {book.price}
                          </div>
                        </div>
                        <button
                          className="book-card-cart-btn"
                          onClick={() => handleAddToCart(book)}
                          disabled={maxed}
                        >
                          <FaCartPlus className="book-card-cart-icon" />
                          {maxed
                            ? `Added (${cartQty}/${book.quantity})`
                            : `Add to Cart (${cartQty}/${book.quantity})`}
                        </button>
                      </div>
                    );
                  })
                }
              </div>
            )}
          </div>
          <aside className="booklist-cart-sidebar">
            <h3>
              <FaCartPlus style={{ marginRight: 8 }} />
              Cart ({totalItems})
            </h3>
            {cartBooks.length === 0 ? (
              <div className="booklist-cart-empty">Cart is empty.</div>
            ) : (
              <>
                <ul>
                  {cartBooks.map((book) => (
                    <li key={book._id}>
                      {book.itemName} - Rs. {book.price} × {cart[book._id]}
                    </li>
                  ))}
                </ul>
                <button
                  className="cart-clear-btn"
                  type="button"
                  onClick={() => setCart({})}
                  style={{ marginBottom: '12px' }}
                >
                  Clear Cart
                </button>
                <div className="booklist-order-summary">
                  <FaReceipt className="order-summary-icon" />
                  <span>
                    <strong>Total Items:</strong> {totalItems}
                  </span>
                  <span>
                    <strong>Total Price:</strong> Rs. {totalPrice}
                  </span>
                </div>
                <form className="cart-payment-form" onSubmit={handlePlaceOrder}>
                  <div className="cart-payment-field">
                    <label>
                      <FaCreditCard className="cart-payment-icon" /> Card Number
                    </label>
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={e =>
                        setCardNumber(
                          e.target.value
                            .replace(/\D/g, '')
                            .replace(/(.{4})/g, '$1 ')
                            .trim()
                        )
                      }
                      required
                    />
                  </div>
                  <div className="cart-payment-row">
                    <div className="cart-payment-field">
                      <label>CVV</label>
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="123"
                        value={cvv}
                        onChange={e => setCvv(e.target.value.replace(/\D/g, ''))}
                        required
                      />
                    </div>
                    <div className="cart-payment-field">
                      <label>Expiry</label>
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={e =>
                          setExpiry(
                            e.target.value
                              .replace(/[^0-9/]/g, '')
                              .replace(/^(\d{2})(\/?)(\d{0,2})$/, '$1/$3')
                              .substr(0, 5)
                          )
                        }
                        required
                      />
                    </div>
                  </div>
                  <button className="cart-place-order-btn" type="submit">
                    Place Order
                  </button>
                  {orderMsg && (
                    <div className="cart-order-msg">{orderMsg}</div>
                  )}
                </form>
              </>
            )}
          </aside>
        </div>
      </main>
      <footer className="booklist-footer">
        <span>© {new Date().getFullYear()} Helpdesk Management System</span>
      </footer>
    </div>
  );
};

export default BookList;