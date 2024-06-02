import React from 'react';
import useCart  from '../hooks/useCart';
import './CartPage.css';

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();

  const handleClearCart = () => {
    clearCart();
  };

  const handleCheckout = () => {
    // Implementar lógica de checkout
    alert('Compra realizada com sucesso!');
    clearCart();
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="cart-container">
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p>Preço: {item.price}€</p>
              <p>Quantidade: {item.quantity}</p>
            </div>
            <button onClick={() => removeFromCart(item.id)} className="cart-remove-button">✖</button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3>Resumo do Carrinho</h3>
        <p>Total de Itens: {cart.length}</p>
        <p>Preço Total: {getTotalPrice()}€</p>
        <button onClick={handleClearCart} className="cart-clear-cart-button">Limpar Carrinho</button>
        <button onClick={handleCheckout} className="cart-checkout-button">Comprar</button>
      </div>
    </div>
  );
};

export default CartPage;