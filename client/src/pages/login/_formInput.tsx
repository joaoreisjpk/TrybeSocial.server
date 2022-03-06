import Form from 'react-bootstrap/Form';
import { Dispatch, SetStateAction } from 'react';

type StateCondition = {
  valid: boolean, invalid: boolean, msg: string,
}

type FormInputProps = {
  stateCondition: StateCondition,
  value: string,
  setValue: Dispatch<SetStateAction<string>>,
  validation(value: string): void,
  name: string,
};

export default function FormInput(
  { stateCondition, value, setValue, validation, name }: FormInputProps
) {
  return (<>
  <Form.Control
    isValid={stateCondition.valid}
    isInvalid={stateCondition.invalid}
    onBlur={({ target }) => validation(target.value)}
    type={ name === 'password' ? 'password' : 'text' }
    name={name}
    className=''
    value={value}
    onChange={({ target }) => setValue(target.value)}
    id={name}
    aria-describedby={`${name}Feedback`}
  />
  <Form.Text id={`${name}Feedback`} muted>
    {stateCondition.msg}
  </Form.Text></>);
}