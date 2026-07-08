import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalRadar } from './useLocalRadar';

describe('useLocalRadar', () => {
  it('debe generar un objetivo con propiedades correctas', () => {
    const { result } = renderHook(() => useLocalRadar());
    act(() => {
      result.current.addRandomTarget();
    });
    const target = result.current.targets[0];
    expect(target).toHaveProperty('id');
    expect(target).toHaveProperty('distance');
    expect(target).toHaveProperty('angleDeg');
    expect(target).toHaveProperty('isThreat');
    expect(typeof target.id).toBe('number');
  });

  it('debe limitar el número de objetivos a 24', () => {
    const { result } = renderHook(() => useLocalRadar());
    act(() => {
      for (let i = 0; i < 30; i++) {
        result.current.addRandomTarget();
      }
    });
    expect(result.current.targets.length).toBeLessThanOrEqual(24);
  });
});