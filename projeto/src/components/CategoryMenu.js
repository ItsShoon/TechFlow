import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';
import './CategoryMenu.css';

const categories = [
  "Motherboards",
  "Processadores",
  "Placas Gráficas",
  "RAM",
  "Discos",
  "Fontes de Alimentação",
  "Caixas",
  "Monitores",
  "Teclados",
  "Ratos"
];

const CategoryMenu = () => {
  return (
    <Menu>
      {categories.map((category, index) => (
        <Link key={index} className="menu-item" to={`/category/${category.toLowerCase()}`}>
          {category}
        </Link>
      ))}
    </Menu>
  );
};

export default CategoryMenu;
