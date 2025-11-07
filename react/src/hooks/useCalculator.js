import { useCallback, useEffect, useMemo, useState } from 'react';

const MAX_LEN = 12;

function isError(v) {
  return v === 'Error';
}

function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

function safeRound(n) {
  if (!Number.isFinite(n)) return n;
  // Round to 12 significant digits to reduce FP noise
  return parseFloat(Number(n).toPrecision(12));
}

function expandScientific(str) {
  if (!/e/i.test(str)) return str;
  const [coeff, expStr] = str.toLowerCase().split('e');
  const exp = parseInt(expStr, 10);
  const [intPart, fracPart = ''] = coeff.split('.');
  const digits = intPart + fracPart;
  if (exp > 0) {
    const zeros = Math.max(0, exp - fracPart.length);
    return digits + '0'.repeat(zeros);
  }
  // exp <= 0
  const abs = Math.abs(exp);
  const zeros = Math.max(0, abs - intPart.length);
  const body = digits.padStart(digits.length + zeros, '0');
  return '0.' + '0'.repeat(abs - 1) + body;
}

function normalizeNumberString(n) {
  if (typeof n === 'string') return n;
  if (!Number.isFinite(n)) return 'Error';
  let s = String(n);
  s = expandScientific(s);
  if (s.includes('.')) {
    // trim trailing zeros
    s = s.replace(/\.0+$/,'').replace(/(\.[0-9]*?)0+$/, '$1');
  }
  return s;
}

function limitDisplayLength(s) {
  if (s.length <= MAX_LEN) return s;
  if (s.includes('.')) {
    // keep integer part and trim fractional
    const [intPart, fracPart = ''] = s.split('.');
    const room = Math.max(0, MAX_LEN - intPart.length - 1);
    return room <= 0 ? intPart.slice(0, MAX_LEN) : intPart + '.' + fracPart.slice(0, room);
  }
  // no decimal, hard cut
  return s.slice(0, MAX_LEN);
}

export default function useCalculator() {
  const [state, setState] = useState({
    prevValue: null,
    currValue: '0',
    operator: null,
    overwrite: false,
    error: false,
  });

  const displayValue = useMemo(() => {
    if (state.error) return 'Error';
    const s = state.currValue;
    // normalize only for display
    const num = Number(s);
    if (Number.isFinite(num)) {
      const normalized = normalizeNumberString(safeRound(num));
      return limitDisplayLength(normalized.startsWith('-0') && !normalized.includes('.') ? normalized.replace('-0', '0') : normalized);
    }
    return s;
  }, [state.currValue, state.error]);

  const clearAll = useCallback(() => {
    setState({ prevValue: null, currValue: '0', operator: null, overwrite: false, error: false });
  }, []);

  const clearEntry = useCallback(() => {
    setState((prev) => ({ ...prev, currValue: '0', overwrite: false, error: false }));
  }, []);

  const inputDigit = useCallback((d) => {
    setState((prev) => {
      if (prev.error) return { prevValue: null, currValue: String(d), operator: null, overwrite: false, error: false };

      if (prev.overwrite) {
        return { ...prev, currValue: String(d), overwrite: false };
      }

      const curr = prev.currValue;
      if (curr === '0') {
        if (d === '0') return prev; // prevent multiple leading zeros
        return { ...prev, currValue: String(d) };
      }

      const pureLen = curr.replace('-', '').replace('.', '').length;
      if (pureLen >= MAX_LEN) return prev;

      return { ...prev, currValue: curr + String(d) };
    });
  }, []);

  const inputDot = useCallback(() => {
    setState((prev) => {
      if (prev.error) return { prevValue: null, currValue: '0.', operator: null, overwrite: false, error: false };
      if (prev.overwrite) return { ...prev, currValue: '0.', overwrite: false };
      if (prev.currValue.includes('.')) return prev;
      const pureLen = prev.currValue.replace('-', '').replace('.', '').length;
      if (pureLen >= MAX_LEN) return prev;
      return { ...prev, currValue: prev.currValue + '.' };
    });
  }, []);

  const operate = useCallback((aStr, bStr, op) => {
    const a = toNumber(aStr);
    const b = toNumber(bStr);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return 'Error';
    let res;
    switch (op) {
      case '+': res = a + b; break;
      case '-': res = a - b; break;
      case '*': res = a * b; break;
      case '/':
        if (b === 0) return 'Error';
        res = a / b; break;
      default: return bStr;
    }
    const rounded = safeRound(res);
    const normalized = normalizeNumberString(rounded);
    return limitDisplayLength(normalized);
  }, []);

  const chooseOperator = useCallback((op) => {
    setState((prev) => {
      if (prev.error) return { prevValue: null, currValue: '0', operator: op, overwrite: true, error: false };

      if (prev.operator && !prev.overwrite && prev.prevValue !== null) {
        const result = operate(prev.prevValue, prev.currValue, prev.operator);
        if (isError(result)) {
          return { prevValue: null, currValue: 'Error', operator: null, overwrite: true, error: true };
        }
        return { prevValue: result, currValue: result, operator: op, overwrite: true, error: false };
      }

      return { prevValue: prev.currValue, currValue: prev.currValue, operator: op, overwrite: true, error: false };
    });
  }, [operate]);

  const equals = useCallback(() => {
    setState((prev) => {
      if (!prev.operator || prev.prevValue === null) return prev;
      const result = operate(prev.prevValue, prev.currValue, prev.operator);
      if (isError(result)) {
        return { prevValue: null, currValue: 'Error', operator: null, overwrite: true, error: true };
      }
      return { prevValue: null, currValue: result, operator: null, overwrite: true, error: false };
    });
  }, [operate]);

  const backspace = useCallback(() => {
    setState((prev) => {
      if (prev.error) return { prevValue: null, currValue: '0', operator: null, overwrite: false, error: false };
      if (prev.overwrite) return prev;
      let next = prev.currValue.slice(0, -1);
      if (next === '' || next === '-' || next === '-0') next = '0';
      return { ...prev, currValue: next };
    });
  }, []);

  const toggleSign = useCallback(() => {
    setState((prev) => {
      if (prev.error) return { prevValue: null, currValue: '0', operator: null, overwrite: false, error: false };
      if (prev.currValue === '0') return prev;
      return { ...prev, currValue: prev.currValue.startsWith('-') ? prev.currValue.slice(1) : '-' + prev.currValue };
    });
  }, []);

  const percent = useCallback(() => {
    setState((prev) => {
      if (prev.error) return { prevValue: null, currValue: '0', operator: null, overwrite: false, error: false };
      const n = toNumber(prev.currValue);
      const result = normalizeNumberString(safeRound(n / 100));
      return { ...prev, currValue: limitDisplayLength(result), overwrite: true };
    });
  }, []);

  const handleKeyDown = useCallback((e) => {
    const key = e.key;
    if (/^[0-9]$/.test(key)) {
      e.preventDefault();
      inputDigit(key);
      return;
    }
    if (key === '.' || key === ',') {
      e.preventDefault();
      inputDot();
      return;
    }
    if (key === '+' || key === '-' || key === '*' || key === '/') {
      e.preventDefault();
      chooseOperator(key);
      return;
    }
    if (key === 'Enter' || key === '=') {
      e.preventDefault();
      equals();
      return;
    }
    if (key === 'Backspace') {
      e.preventDefault();
      backspace();
      return;
    }
    if (key === 'Escape') {
      e.preventDefault();
      clearAll();
      return;
    }
    if (key === 'Delete') {
      e.preventDefault();
      clearEntry();
      return;
    }
    if (key === '%') {
      e.preventDefault();
      percent();
    }
  }, [inputDigit, inputDot, chooseOperator, equals, backspace, clearAll, clearEntry, percent]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
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
    handleKeyDown,
  };
}
