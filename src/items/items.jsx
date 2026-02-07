import React from 'react';
import './items.css'

export default function Items() {
  return (
    <div className='items-container'>
      <section className="add-item">
        <h2>Add Item</h2>
        <form>
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
            <tr>
              <td><span className="list-item-name">Gym</span></td>
              <td><span className="list-item-duration">45m</span></td>
              <td><span className="item-type">Recurring</span></td>
              <td><button type="button">Delete</button></td>
            </tr>
            <tr>
              <td><span className="list-item-name">Class</span></td>
              <td><span className="list-item-duration">60m</span></td>
              <td><span className="item-type">Recurring</span></td>
              <td><button type="button">Delete</button></td>
            </tr>
            <tr>
              <td><span className="list-item-name">Shopping</span></td>
              <td><span className="list-item-duration">45m</span></td>
              <td><span className="item-type">One-Time</span></td>
              <td><button type="button">Delete</button></td>
            </tr>
            <tr>
              <td><span className="list-item-name">Assignment</span></td>
              <td><span className="list-item-duration">90m</span></td>
              <td><span className="item-type">One-Time</span></td>
              <td><button type="button">Delete</button></td>
            </tr>
          </tbody>
        </table> 
      </section>
    </div>
  );
}