const listSum = (a, e) => a + e;

const maxMatch = (score, map) =>
  Object.keys(map)
    .sort((a, b) => map[b] - map[a])
    .find((e) => map[e] <= score);

export const isScoreFail = (score) => score < 50;

export const getSubjectTotal = (item) =>
  item.exam + item.firstTest + item.midTerm + item.pna;

const GRADING = {
  A: 70,
  B: 60,
  C: 50,
  D: 45,
  F: 0,
};

export const getGrade = (item) => {
  const total = getSubjectTotal(item);
  return maxMatch(total, GRADING);
};

export const getTotalMarks = (results) =>
  results.map(getSubjectTotal).reduce(listSum, 0);

export const getAverage = (results) => getTotalMarks(results) / results.length;

const WEIGHTS = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  E: 1,
  F: 0,
};
export const getCGPA = (results) =>
  results
    .map((e) => WEIGHTS[getGrade(e)] * (e.creditLoad ?? 1))
    .reduce(listSum, 0) /
  results.map((e) => e.creditLoad ?? 1).reduce(listSum, 0);

const CLASSES = {
  "First Class": 4.5,
  "Second Class (Upper)": 3.5,
  "Second Class (Lower)": 2.5,
  "Third Class": 1.5,
  Pass: 0,
};

export const getClass = (results) => maxMatch(getCGPA(results), CLASSES);
