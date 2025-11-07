import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';

function getDisplay() {
  return screen.getByRole('status');
}

async function clickByName(user, name) {
  await user.click(screen.getByRole('button', { name }));
}

describe('Calculator basic behavior', () => {
  test('initial display is 0', () => {
    render(<App />);
    expect(getDisplay()).toHaveTextContent('0');
  });

  test('2 + 3 = 5', async () => {
    const user = userEvent.setup();
    render(<App />);

    await clickByName(user, '2');
    await clickByName(user, 'add');
    await clickByName(user, '3');
    await clickByName(user, 'equals');

    expect(getDisplay()).toHaveTextContent('5');
  });

  test('7 ÷ 2 = 3.5', async () => {
    const user = userEvent.setup();
    render(<App />);

    await clickByName(user, '7');
    await clickByName(user, 'divide');
    await clickByName(user, '2');
    await clickByName(user, 'equals');

    expect(getDisplay()).toHaveTextContent('3.5');
  });

  test('0.1 + 0.2 ≈ 0.3', async () => {
    const user = userEvent.setup();
    render(<App />);

    await clickByName(user, '0');
    await clickByName(user, 'decimal');
    await clickByName(user, '1');
    await clickByName(user, 'add');
    await clickByName(user, '0');
    await clickByName(user, 'decimal');
    await clickByName(user, '2');
    await clickByName(user, 'equals');

    expect(getDisplay()).toHaveTextContent('0.3');
  });

  test('division by zero shows Error', async () => {
    const user = userEvent.setup();
    render(<App />);

    await clickByName(user, '7');
    await clickByName(user, 'divide');
    await clickByName(user, '0');
    await clickByName(user, 'equals');

    expect(getDisplay()).toHaveTextContent('Error');
  });

  test('percent: 50 % => 0.5', async () => {
    const user = userEvent.setup();
    render(<App />);

    await clickByName(user, 'all clear');
    await clickByName(user, '5');
    await clickByName(user, '0');
    await clickByName(user, 'percent');

    expect(getDisplay()).toHaveTextContent('0.5');
  });

  test('backspace deletes last digit', async () => {
    const user = userEvent.setup();
    render(<App />);

    await clickByName(user, 'all clear');
    await clickByName(user, '1');
    await clickByName(user, '2');
    await clickByName(user, '3');
    await clickByName(user, 'backspace');

    expect(getDisplay()).toHaveTextContent('12');
  });

  test('C clears entry, AC clears all', async () => {
    const user = userEvent.setup();
    render(<App />);

    // 12 + 3, then C, then 4 = 16
    await clickByName(user, 'all clear');
    await clickByName(user, '1');
    await clickByName(user, '2');
    await clickByName(user, 'add');
    await clickByName(user, '3');
    await clickByName(user, 'clear entry');
    expect(getDisplay()).toHaveTextContent('0');
    await clickByName(user, '4');
    await clickByName(user, 'equals');
    expect(getDisplay()).toHaveTextContent('16');

    // AC resets to 0
    await clickByName(user, 'all clear');
    expect(getDisplay()).toHaveTextContent('0');
  });
});
