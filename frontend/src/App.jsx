import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API = 'http://localhost:8080/api/products';

const EMPTY_FORM = { name: '', description: '', category: '', price: '', stockQuantity: '' };

export default function App() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState('id,asc');
  const [category, setCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [meta, setMeta] = useState({ totalPages: 0, totalElements: 0, last: true, pageNumber: 0 });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [findId, setFindId] = useState('');
  const [foundProduct, setFoundProduct] = useState(null);
  const [findError, setFindError] = useState(null);

  const fetchList = () => {
    setLoading(true);
    const params = { page, size, sort };
    if (category) params.category = category;
    if (maxPrice) params.maxPrice = maxPrice;

    axios.get(API, { params })
      .then(res => {
        setProducts(res.data.content);
        setMeta({
          totalPages: res.data.totalPages,
          totalElements: res.data.totalElements,
          last: res.data.last,
          pageNumber: res.data.pageNumber,
        });
        setError(null);
      })
      .catch(err => {
        setError(err.response?.data?.error || err.message);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(fetchList, [page, size, sort, category, maxPrice]);

  const badgeClass = (cat) => 'badge ' + cat.toLowerCase();

  const openCreate = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditId(p.id);
    setForm({
      name: p.name,
      description: p.description || '',
      category: p.category,
      price: p.price,
      stockQuantity: p.stockQuantity,
    });
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
  };

  const submitForm = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    const body = {
      ...form,
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
    };

    const req = editId
      ? axios.put(`${API}/${editId}`, body)
      : axios.post(API, body);

    req
      .then(() => {
        closeForm();
        fetchList();
      })
      .catch(err => {
        const data = err.response?.data;
        if (data && typeof data === 'object') {
          const msgs = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join(' · ');
          setFormError(msgs || 'Save failed');
        } else {
          setFormError(err.message);
        }
      })
      .finally(() => setSubmitting(false));
  };

  const deleteProduct = (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    axios.delete(`${API}/${p.id}`)
      .then(() => fetchList())
      .catch(err => alert('Delete failed: ' + (err.response?.data?.error || err.message)));
  };

  const handleFind = () => {
    setFoundProduct(null);
    setFindError(null);
    if (!findId) return;
    axios.get(`${API}/${findId}`)
      .then(res => setFoundProduct(res.data))
      .catch(err => setFindError(err.response?.data?.error || err.message));
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Product Catalog</h1>
        <button className="btn-primary" onClick={openCreate}>+ Add Product</button>
      </div>

      <div className="find-bar">
        <input
          type="number"
          placeholder="Find product by ID"
          value={findId}
          onChange={e => setFindId(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleFind()}
        />
        <button className="btn-secondary" onClick={handleFind}>Find</button>
        {findError && <span className="find-error">{findError}</span>}
        {foundProduct && (
          <div className="found-card">
            <strong>#{foundProduct.id} — {foundProduct.name}</strong>
            <span>{foundProduct.category} · {Number(foundProduct.price).toFixed(2)} · stock {foundProduct.stockQuantity}</span>
            <button className="btn-edit" onClick={() => openEdit(foundProduct)}>Edit</button>
            <button className="btn-ghost" onClick={() => { setFoundProduct(null); setFindId(''); }}>Clear</button>
          </div>
        )}
      </div>

      <div className="filters">
        <select value={category} onChange={e => { setCategory(e.target.value); setPage(0); }}>
          <option value="">All Categories</option>
          <option>Electronics</option>
          <option>Books</option>
          <option>Clothing</option>
          <option>Home</option>
          <option>Sports</option>
        </select>

        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={e => { setMaxPrice(e.target.value); setPage(0); }}
        />

        <select value={sort} onChange={e => { setSort(e.target.value); setPage(0); }}>
          <option value="id,asc">Sort: ID asc</option>
          <option value="price,asc">Sort: Price asc</option>
          <option value="price,desc">Sort: Price desc</option>
          <option value="name,asc">Sort: Name asc</option>
          <option value="stockQuantity,desc">Sort: Stock desc</option>
        </select>

        <select value={size} onChange={e => { setSize(Number(e.target.value)); setPage(0); }}>
          <option value={5}>5 / page</option>
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
        </select>
      </div>

      {error && <div className="error">Error: {error}</div>}
      {loading && <div className="loading">Loading products…</div>}

      {!loading && !error && products.length === 0 && (
        <div className="empty">No products match your filters.</div>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td className="id">{p.id}</td>
                    <td className="name">{p.name}</td>
                    <td><span className={badgeClass(p.category)}>{p.category}</span></td>
                    <td className="price">{Number(p.price).toFixed(2)}</td>
                    <td className="stock">{p.stockQuantity}</td>
                    <td className="actions">
                      <button className="btn-edit" onClick={() => openEdit(p)}>Edit</button>
                      <button className="btn-danger" onClick={() => deleteProduct(p)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <div className="info">
              Page <strong>{meta.pageNumber + 1}</strong> of <strong>{meta.totalPages}</strong>
              {' · '}
              <strong>{meta.totalElements.toLocaleString()}</strong> products total
            </div>
            <div className="buttons">
              <button disabled={page === 0} onClick={() => setPage(page - 1)}>← Previous</button>
              <button disabled={meta.last} onClick={() => setPage(page + 1)}>Next →</button>
            </div>
          </div>
        </>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editId ? `Edit Product #${editId}` : 'Add New Product'}</h2>

            <form onSubmit={submitForm}>
              <label>
                Name *
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </label>

              <label>
                Description
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={2}
                />
              </label>

              <label>
                Category *
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  required
                >
                  <option value="">— select —</option>
                  <option>Electronics</option>
                  <option>Books</option>
                  <option>Clothing</option>
                  <option>Home</option>
                  <option>Sports</option>
                </select>
              </label>

              <div className="form-row">
                <label>
                  Price *
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    required
                  />
                </label>

                <label>
                  Stock *
                  <input
                    type="number"
                    min="0"
                    value={form.stockQuantity}
                    onChange={e => setForm({ ...form, stockQuantity: e.target.value })}
                    required
                  />
                </label>
              </div>

              {formError && <div className="form-error">{formError}</div>}

              <div className="form-actions">
                <button type="button" className="btn-ghost" onClick={closeForm} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Saving…' : editId ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}