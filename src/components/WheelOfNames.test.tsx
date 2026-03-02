import { render, screen, fireEvent, act } from '@testing-library/react';
import WheelOfNames from './WheelOfNames';

jest.useFakeTimers();

describe('WheelOfNames', () => {
  const names = ['Alice', 'Bob', 'Charlie'];

  it('renders all names', () => {
    render(<WheelOfNames names={names} />);
    names.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it('spins and selects a winner', () => {
    render(<WheelOfNames names={names} />);
    const button = screen.getByRole('button', { name: /spin the wheel/i });
    fireEvent.click(button);
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    // After spin, a winner should be shown
    const winner = screen.getByText(/winner:/i).nextSibling;
    expect(winner).toBeTruthy();
    expect(names).toContain(winner?.textContent || '');
  });

  it('calls onRemoveName with the winner', () => {
    const onRemoveName = jest.fn();
    render(<WheelOfNames names={names} onRemoveName={onRemoveName} />);
    const button = screen.getByRole('button', { name: /spin the wheel/i });
    fireEvent.click(button);
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    const removeBtn = screen.getByRole('button', { name: /remove winner/i });
    fireEvent.click(removeBtn);
    // Should be called with a valid name
    expect(onRemoveName).toHaveBeenCalledWith(expect.stringMatching(/Alice|Bob|Charlie/));
  });
});
