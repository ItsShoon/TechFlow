import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CampaignProducts.css';

const CampaignProducts = ({ products, campaignProducts, onAddProductToCampaign, onRemoveProductFromCampaign }) => {
  const { campaignId } = useParams();
  const productsInCampaign = campaignProducts.filter(cp => cp.campaignId === parseInt(campaignId)).map(cp => cp.productId);
  const availableProducts = products.filter(p => !productsInCampaign.includes(p.id));

  return (
    <div className="manage-campaign-products-container">
      <h2>Gerir Produtos da Campanha</h2>
      <div className="available-products">
        <h3>Produtos Disponíveis</h3>
        <ul>
          {availableProducts.map(product => (
            <li key={product.id}>
              {product.name}
              <button onClick={() => onAddProductToCampaign(parseInt(campaignId), product.id)}>Adicionar</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="campaign-products">
        <h3>Produtos na Campanha</h3>
        <ul>
          {productsInCampaign.map(productId => {
            const product = products.find(p => p.id === productId);
            return (
              <li key={productId}>
                {product.name}
                <button onClick={() => onRemoveProductFromCampaign(parseInt(campaignId), productId)}>Remover</button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default CampaignProducts;