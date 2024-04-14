import React from 'react';
import * as style from './GenericContextUser.module.css'

import { GenericContext } from '../components/GenericProvider';


function GenericContextUser() {
  const { createItem } = React.useContext(GenericContext);
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

export default GenericContextUser;


