import React from 'react';

const SampleComponent = () => {
  return (
    <div>
      <h1>Welcome to Our Website</h1>
      <img src="image.jpg" alt="" /> {/* Missing alt text */}
      <button onClick={() => alert('Clicked!')}>Click Me</button> {/* No accessible name */}
      <form>
        <label>
          Name:
          <input type="text" />
        </label>
        <label>
          Email:
          <input type="email" />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SampleComponent;