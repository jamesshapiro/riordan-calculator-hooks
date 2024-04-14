import React from 'react';

import { DataContext } from '../components/DataProvider';


function DataContextUser() {
  const { createItem } = React.useContext(DataContext);
  function handleSubmit(event) {
    event.preventDefault();
    createItem('Content Submitted.', 'success')
  }

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input id="name" required={true} />

        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
        />

        <button>Submit</button>
      </form>
    </main>
  );
}

export default DataContextUser;


