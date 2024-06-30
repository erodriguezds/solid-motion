


export const linear = (x: number) => x;

export const easeOutQuart = (x: number) => 1 - Math.pow(1 - x, 4);

export function easeOutBack(x: number): number {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}
