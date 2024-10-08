export const runMonteCarlo = (results, iterations) => {
  const returns = results.map((r, i) => 
    i === 0 ? 0 : (r.capital - results[i-1].capital) / results[i-1].capital
  );

  const simulatedReturns = [];
  for (let i = 0; i < iterations; i++) {
    let simulatedCapital = results[0].capital;
    for (let j = 0; j < returns.length; j++) {
      const randomReturn = returns[Math.floor(Math.random() * returns.length)];
      simulatedCapital *= (1 + randomReturn);
    }
    const totalReturn = (simulatedCapital / results[0].capital - 1) * 100;
    simulatedReturns.push(totalReturn);
  }

  // Criar histograma de retornos
  const histogram = {};
  const binSize = 1; // Tamanho do bin em porcentagem
  simulatedReturns.forEach(r => {
    const bin = Math.floor(r / binSize) * binSize;
    histogram[bin] = (histogram[bin] || 0) + 1;
  });

  return Object.entries(histogram).map(([return_, frequency]) => ({
    return: Number(return_),
    frequency: frequency / iterations
  })).sort((a, b) => a.return - b.return);
};