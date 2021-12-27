import React, { useState, useRef, SyntheticEvent } from 'react';
import { onlyNumbers } from 'src/helpers';

interface IInputProps {
  length: number;
  maxLength?: number;
  onSubmit?: any;
}

const InputCode = ({ ...props }: IInputProps) => {
  const [code, setCode] = useState([...Array(props.length)].map(() => ''));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const processInput = (
    e: React.ChangeEvent<SyntheticEvent | any>,
    slot: number
  ) => {
    const num = onlyNumbers(e.target.value);
    const max_length = () => {
      if (props.maxLength) {
        return num.length === props.maxLength && slot !== props.length - 1;
      } else {
        return num.length && slot !== props.length - 1;
      }
    };
    const newCode = [...code];
    newCode[slot] = num;
    setCode(newCode);
    if (max_length()) {
      e.target.nextElementSibling.focus();
    } else if (!num && slot !== 0) {
      e.target.previousElementSibling.focus();
    }
  };

  function handleSubmit(evt: any) {
    evt.preventDefault();
    const values = Object.values(code);

    if (values.some((v) => v === '')) {
      // TODO: improve error handling
      console.error('All inputs need to be populated');
      return;
    }

    const returnValue = JSON.stringify(values).replace(/\D/g, '');

    return returnValue;
  }

  return (
    <form onSubmit={props.onSubmit}>
      {code.map((num, idx) => {
        return (
          <input
            key={idx}
            type="text"
            inputMode="numeric"
            maxLength={props.maxLength ? props.maxLength : 1}
            value={num}
            autoFocus={!code[0].length && idx === 0}
            onChange={(e) => processInput(e, idx)}
            ref={(ref) => inputs.current.push(ref)}
          />
        );
      })}
      <button type={'submit'}>test</button>
    </form>
  );
};

export default InputCode;
