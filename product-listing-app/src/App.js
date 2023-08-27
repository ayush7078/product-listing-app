import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [minPriceFilter, setMinPriceFilter] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState('');
  const [sortOption, setSortOption] = useState('name');
  const [categories, setCategories] = useState([]); 

  useEffect(() => {
    fetchProducts();
  }, []);

  const apiUrl = 'https://dummyjson.com/products'; // Replace with actual API URL

  // Inside the fetchProducts function
async function fetchProducts() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    setProducts(data.products);
    setFilteredProducts(data.products);

    // Fetch and set product categories
    const categoriesResponse = await fetch('https://dummyjson.com/products/categories');
    const categoriesData = await categoriesResponse.json();
    setCategories(categoriesData);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

  const applyFiltersAndSorting = () => {
    const filtered = products.filter(product => {
      return (
        (categoryFilter === '' || product.category === categoryFilter) &&
        (!minPriceFilter || product.price >= parseFloat(minPriceFilter)) &&
        (!maxPriceFilter || product.price <= parseFloat(maxPriceFilter))
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortOption === 'name') {
        return a.title.localeCompare(b.title);
      } else if (sortOption === 'price') {
        return a.price - b.price;
      }
      return 0;
    });
  
    setFilteredProducts(sorted);
  };

  return (
    <div className="App">
      <header className="App-header">
      <h1>Product Listing</h1>
      <div className="filters">
  <label htmlFor="category">Category:</label>
  <select
    id="category"
    value={categoryFilter}
    onChange={e => setCategoryFilter(e.target.value)}
  >
    <option value="">All</option>
    {categories.map(category => (
      <option key={category} value={category}>
        {category}
      </option>
    ))}
  </select>
          <label htmlFor="minPrice">Min Price:</label>
          <input
            type="number"
            id="minPrice"
            value={minPriceFilter}
            onChange={e => setMinPriceFilter(e.target.value)}
          />
          <label htmlFor="maxPrice">Max Price:</label>
          <input
            type="number"
            id="maxPrice"
            value={maxPriceFilter}
            onChange={e => setMaxPriceFilter(e.target.value)}
          />
          {/* <button onClick={applyFiltersAndSorting}>Filter</button> */}
        </div>
        <div className="sorting">
  <label htmlFor="sort">Sort By:</label>
  <select
    id="sort"
    value={sortOption}
    onChange={e => setSortOption(e.target.value)}
  >
    <option value="name">Name</option>
    <option value="price">Price</option>
    <option value="price">Rating</option>
  </select>
</div>
<button onClick={applyFiltersAndSorting}>Filter</button>
      </header>
      <main className="product-list">
  {filteredProducts.length > 0 ? (
    filteredProducts.map(product => (
      <div className="product" key={product.id}>
        <img src={product.thumbnail} alt={product.title} />
        <h3>{product.title}</h3>
        <p>Price: ${product.price}</p>
        <p>Description: {product.description}</p>
      </div>
    ))
  ) : (
    <p>No products match the selected filters.</p>
  )}
</main>

    </div>
  );
}

export default App;
