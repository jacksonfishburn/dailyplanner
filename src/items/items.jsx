import './items.css'
import React, { useState } from 'react';

export default function Items({ items, setItems }) {

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      name: e.target.itemName.value,
      time: parseInt(e.target.itemDuration.value),
      isRecurring: e.target.varRadio.value === 'recurring'
    };
    setItems([...items, newItem]);
    e.target.reset();
  };

  const handleDelete = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className='items-container'>
      <section className="add-item">
        <h2>Add Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="name-and-time">
            <div>
              <label htmlFor="itemName" className="label">Name</label>
              <input id="itemName" name="itemName" type="text" placeholder="Enter name for item" className="items-input" required />
            </div>
            <div>
              <label htmlFor="itemDuration" className="label">Duration (minutes)</label>
              <input id="itemDuration" name="itemDuration" type="number" min="15" step="5" defaultValue="60" className="items-input" required />
            </div>
          </div>
          <div className="item-type-radio">
            <fieldset>
              <legend>Item Type</legend>
              <div>
                <input type="radio" id="onetime" name="varRadio" value="onetime" defaultChecked />
                <label htmlFor="onetime" className="selection">One-Time Item</label>
                <input type="radio" id="recurring" name="varRadio" value="recurring" />
                <label htmlFor="recurring" className="selection">Recurring Item</label>
              </div>
            </fieldset>
          </div>
          <button type="submit" className="add-item-button">Add Item</button>
        </form>
      </section>
        
      <section className="item-table">
        <h2>Items</h2>
        <table className="item-table">
          <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td><span className="list-item-name">{item.name}</span></td>
                  <td><span className="list-item-duration">{item.time}m</span></td>
                  <td><span className="item-type">{item.isRecurring ? 'Recurring' : 'One-Time'}</span></td>
                  <td><button type="button" onClick={() => handleDelete(index)}>Delete</button></td>
                </tr>
              ))}
          </tbody>
        </table> 
      </section>
    </div>
  );
}