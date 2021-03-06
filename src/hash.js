const fnvPrime32 = 16777619
const fnvOffset32 = 2166136261

function mul32(int1, int2) {
  const lowerInt1 = int1 & 0xffff
  const higher = ((int1 - lowerInt1) * int2) | 0
  const lower = lowerInt1 * int2
  return (higher + lower) | 0
}

const addByte = (int, b) => mul32(int ^ b, fnvPrime32)
const bytesOf = int =>
  (int & 255) === int ? [int] : bytesOf(int >>> 8).concat(int & 255)
const hashSum = (...ints) =>
  ints.reduce((h, int) => bytesOf(int).reduce(addByte, h))

export function series(seed) {
  const keys = {}
  let counter = seed
  function keyHash(key) {
    if (key in keys) {
      return keys[key]
    }

    const h = hashSum(fnvOffset32, counter)
    counter++
    keys[key] = h
    return h
  }

  return (key, ...hashes) => hashSum(keyHash(key), ...hashes)
}

export default series(0)
