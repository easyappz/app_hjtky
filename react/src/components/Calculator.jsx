import React from 'react';
import KeyButton from './KeyButton';
import useCalculator from '../hooks/useCalculator';

function Calculator() {
  const {
    displayValue,
    inputDigit,
    inputDot,
    chooseOperator,
    equals,
    clearAll,
    clearEntry,
    backspace,
    toggleSign,
    percent,
  } = useCalculator();

  return (
    <section className="calculator" data-easytag="id1-src/components/Calculator.jsx">
      <div
        className="calc-display"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-easytag="id2-src/components/Calculator.jsx"
      >
        {displayValue}
      </div>

      <div className="keypad" data-easytag="id3-src/components/Calculator.jsx">
        {/* Row 1 */}
        <KeyButton
          label="AC"
          ariaLabel="all clear"
          onClick={clearAll}
          variant="utility"
          dataTag="id4-src/components/Calculator.jsx"
        />
        <KeyButton
          label="C"
          ariaLabel="clear entry"
          onClick={clearEntry}
          variant="utility"
          dataTag="id5-src/components/Calculator.jsx"
        />
        <KeyButton
          label="⌫"
          ariaLabel="backspace"
          onClick={backspace}
          variant="utility"
          dataTag="id6-src/components/Calculator.jsx"
        />
        <KeyButton
          label="÷"
          ariaLabel="divide"
          onClick={() => chooseOperator('/')}
          variant="operator"
          dataTag="id7-src/components/Calculator.jsx"
        />

        {/* Row 2 */}
        <KeyButton label="7" onClick={() => inputDigit('7')} dataTag="id8-src/components/Calculator.jsx" />
        <KeyButton label="8" onClick={() => inputDigit('8')} dataTag="id9-src/components/Calculator.jsx" />
        <KeyButton label="9" onClick={() => inputDigit('9')} dataTag="id10-src/components/Calculator.jsx" />
        <KeyButton
          label="×"
          ariaLabel="multiply"
          onClick={() => chooseOperator('*')}
          variant="operator"
          dataTag="id11-src/components/Calculator.jsx"
        />

        {/* Row 3 */}
        <KeyButton label="4" onClick={() => inputDigit('4')} dataTag="id12-src/components/Calculator.jsx" />
        <KeyButton label="5" onClick={() => inputDigit('5')} dataTag="id13-src/components/Calculator.jsx" />
        <KeyButton label="6" onClick={() => inputDigit('6')} dataTag="id14-src/components/Calculator.jsx" />
        <KeyButton
          label="−"
          ariaLabel="subtract"
          onClick={() => chooseOperator('-')}
          variant="operator"
          dataTag="id15-src/components/Calculator.jsx"
        />

        {/* Row 4 */}
        <KeyButton label="1" onClick={() => inputDigit('1')} dataTag="id16-src/components/Calculator.jsx" />
        <KeyButton label="2" onClick={() => inputDigit('2')} dataTag="id17-src/components/Calculator.jsx" />
        <KeyButton label="3" onClick={() => inputDigit('3')} dataTag="id18-src/components/Calculator.jsx" />
        <KeyButton
          label="+"
          ariaLabel="add"
          onClick={() => chooseOperator('+')}
          variant="operator"
          dataTag="id19-src/components/Calculator.jsx"
        />

        {/* Row 5 */}
        <KeyButton
          label="±"
          ariaLabel="toggle sign"
          onClick={toggleSign}
          variant="utility"
          dataTag="id20-src/components/Calculator.jsx"
        />
        <KeyButton
          label="0"
          onClick={() => inputDigit('0')}
          wide
          dataTag="id21-src/components/Calculator.jsx"
        />
        <KeyButton
          label="."
          ariaLabel="decimal"
          onClick={inputDot}
          dataTag="id22-src/components/Calculator.jsx"
        />
        <KeyButton
          label="%"
          ariaLabel="percent"
          onClick={percent}
          variant="utility"
          dataTag="id23-src/components/Calculator.jsx"
        />
        <KeyButton
          label="="
          ariaLabel="equals"
          onClick={equals}
          variant="equals"
          dataTag="id24-src/components/Calculator.jsx"
        />
      </div>
    </section>
  );
}

export default Calculator;
