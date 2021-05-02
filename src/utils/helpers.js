const getRandomValue = arr => arr[Math.floor(Math.random() * arr.length)];

const analyseStats = arr => {
    const flawless = arr.filter(round => round.mistakes === 0).length;
    const avgTries = arr.reduce((acc, round) => (acc += round.mistakes + 1), 0) / arr.length;
    const suffixAnalysis = arr.reduce((acc, round) => {
        acc[round.suffix]?.count ? (acc[round.suffix].count += 1) : (acc[round.suffix] = { count: 1 });
        acc[round.suffix].mistakes !== undefined
            ? (acc[round.suffix].mistakes += round.mistakes)
            : (acc[round.suffix].mistakes = round.mistakes);

        return acc;
    }, {});

    const mistakeRatios = Object.entries(suffixAnalysis)
        .map(([suffix, obj]) => {
            return { suffix, mistakes: obj.mistakes, count: obj.count, ratio: obj.mistakes / obj.count };
        })
        .sort((a, b) => a.ratio - b.ratio);

    const bestIdentified = mistakeRatios.slice(0, 3);
    const worstIdentified = mistakeRatios
        .slice(-3)
        .filter(item => item.mistakes !== 0)
        .reverse();

    return { flawless, avgTries, bestIdentified, worstIdentified };
};

export { getRandomValue, analyseStats };
