import React, { useState } from 'react';
import { data } from './mock';
import './styles.scss';
import InputCode from '././components/InputCode';

const App: React.FC = () => {
  const [value, setValue] = useState<any>();
  const mockData = data.dados.numbers.map((e: any) => JSON.stringify(e.test));

  function process(form: any) {
    var inputs = Array.from(form.elements);

    return inputs.map((e: any) => e.value);
  }

  return (
    <>
      <div className="container">
        <InputCode
          length={2}
          maxLength={2}
          onSubmit={(e: any) => {
            e.preventDefault();
            setValue(process(e.target));
          }}
        />
      </div>
    </>
  );
};

export default App;
