export const db = {
  getItems: () => {
    const saved = localStorage.getItem('items');
    return saved ? JSON.parse(saved) : null;
  },
  setItems: (items) => {
    localStorage.setItem('items', JSON.stringify(items));
  },

  getScheduledItems: () => {
    const saved = localStorage.getItem('scheduledItems');
    return saved ? JSON.parse(saved) : null;
  },
  setScheduledItems: (scheduledItems) => {
    localStorage.setItem('scheduledItems', JSON.stringify(scheduledItems));
  },
};
