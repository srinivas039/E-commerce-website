import { useState, useEffect } from 'react';
import api from '../api';
import { Package, DollarSign, PlusCircle, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
    const [sales, setSales] = useState(0);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stockQuantity: '', categoryId: '', imageUrl: '' });
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            const [salesRes, prodRes, catRes] = await Promise.all([
                api.get('/admin/sales').catch(() => ({ data: { totalSales: 0 } })),
                api.get('/products'),
                api.get('/categories')
            ]);
            setSales(salesRes.data.totalSales || 0);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        } catch {
            console.error('Failed to load dashboard data');
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProduct(prev => ({ ...prev, imageUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        } else {
            setNewProduct(prev => ({ ...prev, imageUrl: '' }));
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const productData = { 
                ...newProduct, 
                price: parseFloat(newProduct.price), 
                stockQuantity: parseInt(newProduct.stockQuantity),
                category: { id: parseInt(newProduct.categoryId) } 
            };
            await api.post('/admin/products', productData);
            setNewProduct({ name: '', description: '', price: '', stockQuantity: '', categoryId: '', imageUrl: '' });
            fetchData();
            setError('');
        } catch {
            setError('Failed to add product');
        }
    };

    const handleDeleteProduct = async (id) => {
        if(window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/admin/products/${id}`);
                fetchData();
            } catch {
                console.error("Failed to delete product");
            }
        }
    };

    return (
        <div>
            <h1 style={{ marginBottom: '40px' }}>Admin Dashboard</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ background: 'var(--primary-light)', padding: '16px', borderRadius: '12px', color: 'var(--primary)' }}>
                        <DollarSign size={32} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Sales</p>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text)' }}>₹{sales.toFixed(2)}</h2>
                    </div>
                </div>
                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ background: '#fff7ed', padding: '16px', borderRadius: '12px', color: 'var(--accent)' }}>
                        <Package size={32} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Products</p>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text)' }}>{products.length}</h2>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                <div className="glass-card" style={{ flex: 1, minWidth: '350px' }}>
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <PlusCircle /> Add New Product
                    </h3>
                    {error && <p style={{ color: '#ef4444', marginBottom: '15px' }}>{error}</p>}
                    <form onSubmit={handleAddProduct}>
                        <div className="input-group">
                            <label>Name</label>
                            <input type="text" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                        </div>
                        <div className="input-group">
                            <label>Description</label>
                            <textarea required rows="3" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}></textarea>
                        </div>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div className="input-group" style={{ flex: 1 }}>
                                <label>Price (₹)</label>
                                <input type="number" step="0.01" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                            </div>
                            <div className="input-group" style={{ flex: 1 }}>
                                <label>Stock</label>
                                <input type="number" required value={newProduct.stockQuantity} onChange={e => setNewProduct({...newProduct, stockQuantity: e.target.value})} />
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Category</label>
                            <select required value={newProduct.categoryId} onChange={e => setNewProduct({...newProduct, categoryId: e.target.value})}>
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Product Image (Optional)</label>
                            <input type="file" accept="image/*" onChange={handleImageChange} />
                            {newProduct.imageUrl && (
                                <img src={newProduct.imageUrl} alt="Preview" style={{ marginTop: '10px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                            )}
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Product</button>
                    </form>
                </div>

                <div className="glass-card" style={{ flex: 2, minWidth: '350px', maxHeight: '600px', overflowY: 'auto' }}>
                    <h3 style={{ marginBottom: '20px' }}>Manage Products</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '15px 10px' }}>Name</th>
                                <th style={{ padding: '15px 10px' }}>Price</th>
                                <th style={{ padding: '15px 10px' }}>Stock</th>
                                <th style={{ padding: '15px 10px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '15px 10px' }}>{p.name}</td>
                                    <td style={{ padding: '15px 10px', color: 'var(--primary)' }}>₹{p.price}</td>
                                    <td style={{ padding: '15px 10px' }}>{p.stockQuantity}</td>
                                    <td style={{ padding: '15px 10px' }}>
                                        <button className="btn btn-outline" style={{ color: '#ef4444', borderColor: 'transparent', padding: '5px' }} onClick={() => handleDeleteProduct(p.id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>No products available.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
