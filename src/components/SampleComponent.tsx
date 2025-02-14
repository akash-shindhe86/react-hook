import React from 'react';

interface Props {
  title: string;
  description: string;
}

const SampleComponent: React.FC<Props> = ({ title, description }) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
};

export default SampleComponent;