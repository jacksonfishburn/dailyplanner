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
              <label for="itemName" className="label">Name</label>
              <input id="itemName" name="itemName" type="text" placeholder="Enter name for item" className="items-input" required />
            </div>
            <div>
              <label for="itemDuration" className="label">Duration (minutes)</label>
              <input id="itemDuration" name="itemDuration" type="number" min="15" step="5" value="60" className="items-input" required />
            </div>
          </div>
          <div className="item-type-radio">
            <fieldset>
              <legend>Item Type</legend>
              <input type="radio" id="onetime" name="varRadio" value="onetime" checked />
              <label for="onetime" className="selection">One-Time Item</label>
              <input type="radio" id="recurring" name="varRadio" value="recurring" />
              <label for="recurring" className="selection">Recurring Item</label>
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
              <td>
                <span className="item-name">Gym</span>
              </td>
              <td>
                <span className="item-duration">45m</span>
              </td>
              <td><span className="item-type">Recurring</span></td>
              <td>
                  <button type="button">Delete</button>
              </td>
            </tr>
            <tr>
              <td>
                <span className="item-name">Class</span>
              </td>
              <td>
                <span className="item-duration">60m</span>
              </td>
              <td><span className="item-type">Recurring</span></td>
              <td>
                <button type="button">Delete</button>
              </td>
            </tr>
            <tr>
              <td>
                <span className="item-name">Shopping</span>
              </td>
              <td>
                <span className="item-duration">45m</span>
              </td>
              <td><span className="item-type">One-Time</span></td>
              <td>
                <button type="button">Delete</button>
              </td>
            </tr>
            <tr>
              <td>
                <span className="item-name">Assignment</span>
              </td>
              <td>
                <span className="item-duration">90m</span>
              </td>
              <td><span className="item-type">One-Time</span></td>
              <td>
                <button type="button">Delete</button>
              </td>
            </tr>
          </tbody>
        </table> 
      </section>
    </div>
  );
}
