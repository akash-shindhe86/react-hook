import React from 'react';
import ReactDOM from 'react-dom';
import SampleComponent from './SampleComponent';

const App: React.FC = () => {
  return (
    <div>
      <SampleComponent title="Hello, World!" description="This is a sample component for testing." />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));