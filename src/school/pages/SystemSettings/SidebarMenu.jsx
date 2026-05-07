import { useState } from 'react';
import './SystemSettings.css';

export default function SidebarMenu() {
  const [menuItems, setMenuItems] = useState([
    { id: 1, title: 'Dashboard', path: '/dashboard', visible: true, order: 1 },
    { id: 2, title: 'Students', path: '/students', visible: true, order: 2 },
    { id: 3, title: 'Teachers', path: '/teachers', visible: true, order: 3 },
    { id: 4, title: 'Finance', path: '/finance', visible: true, order: 4 },
    { id: 5, title: 'Academics', path: '/academics', visible: true, order: 5 },
  ]);

  const [newItem, setNewItem] = useState({ title: '', path: '' });

  const handleAddItem = () => {
    if (newItem.title && newItem.path) {
      setMenuItems([...menuItems, { 
        id: Date.now(), 
        ...newItem, 
        visible: true, 
        order: menuItems.length + 1 
      }]);
      setNewItem({ title: '', path: '' });
      alert('Menu item added successfully');
    }
  };

  const handleToggleVisibility = (id) => {
    setMenuItems(menuItems.map(item =>
      item.id === id ? { ...item, visible: !item.visible } : item
    ));
  };

  const handleMoveUp = (index) => {
    if (index > 0) {
      const updated = [...menuItems];
      [updated[index].order, updated[index - 1].order] = [updated[index - 1].order, updated[index].order];
      setMenuItems(updated.sort((a, b) => a.order - b.order));
    }
  };

  const handleMoveDown = (index) => {
    if (index < menuItems.length - 1) {
      const updated = [...menuItems];
      [updated[index].order, updated[index + 1].order] = [updated[index + 1].order, updated[index].order];
      setMenuItems(updated.sort((a, b) => a.order - b.order));
    }
  };

  const handleSave = () => {
    console.log('Saving sidebar menu:', menuItems);
    alert('Sidebar menu saved successfully');
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Sidebar Menu Configuration</h2>
      </div>
      <div className="settings-form">
        <table className="settings-table">
          <thead>
            <tr>
              <th>Menu Item</th>
              <th>Path</th>
              <th>Visible</th>
              <th>Order</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item, index) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.path}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={item.visible}
                    onChange={() => handleToggleVisibility(item.id)}
                  />
                </td>
                <td>{item.order}</td>
                <td>
                  <button 
                    className="btn-small"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                  >
                    ↑
                  </button>
                  <button 
                    className="btn-small"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === menuItems.length - 1}
                  >
                    ↓
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Add Menu Item</h3>
        <div className="form-group">
          <label>Menu Title</label>
          <input
            type="text"
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            placeholder="Enter menu title"
          />
        </div>
        <div className="form-group">
          <label>Menu Path</label>
          <input
            type="text"
            value={newItem.path}
            onChange={(e) => setNewItem({ ...newItem, path: e.target.value })}
            placeholder="/path/to/menu"
          />
        </div>
        <button className="btn-save" onClick={handleAddItem}>
          Add Menu Item
        </button>
        <button className="btn-save" onClick={handleSave}>
          Save All Changes
        </button>
      </div>
    </div>
  );
}
