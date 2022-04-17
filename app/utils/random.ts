import Gen from "./mersenne";

// https://github.com/faker-js/faker
const gen = new Gen();

/**
 * Generates a random number between `[min, max)`.
 *
 * @param max The maximum number. Defaults to `0`.
 * @param min The minimum number. Defaults to `32768`.
 *
 * @example
 * faker.mersenne.rand() // 15515
 * faker.mersenne.rand(500, 1000) // 578
 */
const rand = (max = 32768, min = 0): number => {
  if (min > max) {
    const temp = min;
    min = max;
    max = temp;
  }

  return Math.floor(gen.genrandReal2() * (max - min) + min);
};

/**
 * Returns a single random number between zero and the given max value or the given range with the specified precision.
 * The bounds are inclusive.
 *
 * @param options Maximum value or options object.
 * @param options.min Lower bound for generated number. Defaults to `0`.
 * @param options.max Upper bound for generated number. Defaults to `min + 99999`.
 * @param options.precision Precision of the generated number. Defaults to `1`.
 *
 * @throws When options define `max < min`.
 *
 * @example
 * faker.datatype.number() // 55422
 * faker.datatype.number(100) // 52
 * faker.datatype.number({ min: 1000000 }) // 431433
 * faker.datatype.number({ max: 100 }) // 42
 * faker.datatype.number({ precision: 0.01 }) // 64246.18
 * faker.datatype.number({ min: 10, max: 100, precision: 0.01 }) // 36.94
 */
const number = (
  options: number | { min?: number; max?: number; precision?: number } = 99999
): number => {
  if (typeof options === "number") {
    options = { max: options };
  }

  const { min = 0, precision = 1 } = options;
  const max = options.max ?? min + 99999;

  if (max === min) {
    return min;
  }

  if (max < min) {
    throw new Error(`Max ${max} should be larger then min ${min}.`);
  }

  const randomNumber = Math.floor(rand(max / precision + 1, min / precision));

  // Workaround problem in float point arithmetics for e.g. 6681493 / 0.01
  return randomNumber / (1 / precision);
};

/**
 * Generates a random css hex color code in aesthetically pleasing color palette.
 *
 * Based on
 * http://stackoverflow.com/questions/43044/algorithm-to-randomly-generate-an-aesthetically-pleasing-color-palette
 *
 * @param redBase The optional base red in range between `0` and `255`. Defaults to `0`.
 * @param greenBase The optional base green in range between `0` and `255`. Defaults to `0`.
 * @param blueBase The optional base blue in range between `0` and `255`. Defaults to `0`.
 *
 * @example
 * faker.internet.color() // '#30686e'
 * faker.internet.color(100, 100, 100) // '#4e5f8b'
 */
const color = (
  redBase: number = 0,
  greenBase: number = 0,
  blueBase: number = 0
): string => {
  const colorFromBase = (base: number): string =>
    Math.floor((number(256) + base) / 2)
      .toString(16)
      .padStart(2, "0");

  const red = colorFromBase(redBase);
  const green = colorFromBase(greenBase);
  const blue = colorFromBase(blueBase);

  return `#${red}${green}${blue}`;
};

export { color, rand };
