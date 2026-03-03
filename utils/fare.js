export function calculateFare(distance) {
  const baseFare = 10;
  const perKmRate = 3;

  const fare = baseFare + distance * perKmRate;

  return Math.max(fare, 20).toFixed(2);
}