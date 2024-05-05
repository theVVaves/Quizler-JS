import fs from 'fs'
import R from 'ramda'

const chooseRandom = R.curry((array = [], numItems = 1) => (
  numItems > 1 && R.length(array) > 1
    ? R.pipe(
      R.slice(0, numItems),
      R.sort(() => 0.5 - Math.random())
    )(array)
    : array
))

// const createPrompt = R.curry(({ numQuestions = 1, numChoices = 2 } = {}) => {
//   return R.concat(
//     R.map((i) => ({
//       type: "input",
//       name: `question-${i + 1}`,
//       message: `Enter question ${i + 1}`,
//     }), R.range(0, numQuestions)),
//     R.chain((i) => R.map((j) => ({
//       type: "input",
//       name: `question-${i + 1}-choice-${j + 1}`,
//       message: `Enter answer choice ${j + 1} for question ${i + 1}`,
//     }), R.range(0, numChoices)), R.range(0, numQuestions))
//   )
// })

const createPrompt = R.curry(({ numQuestions = 1, numChoices = 2 } = {}) => {
  const createQuestion = (i) => ({
    type: "input",
    name: `question-${i + 1}`,
    message: `Enter question ${i + 1}`,
  })

  const createChoice = (i, j) => ({
    type: "input",
    name: `question-${i + 1}-choice-${j + 1}`,
    message: `Enter answer choice ${j + 1} for question ${i + 1}`,
  })

  const questions = R.chain((i) =>
    R.map(R.partial(createChoice, [i]), R.range(0, numChoices)), R.range(0, numQuestions))
  const choices = R.map(createQuestion, R.range(0, numQuestions))

  return R.concat(choices, questions)
})


//  const createQuestions = R.curry((object = {}) => {
//   return R.pipe(
//     R.keys,
//     R.filter((key) => key.includes('question-') && R.test(/^question-\d+$/, key)),
//     R.map((key) => {
//       const choices = R.filter((choiceKey) =>
//         choiceKey.includes(`${key}-choice-`) && R.test(/^question-\d+-choice-\d+$/, choiceKey), R.keys(object))
//       return {
//         type: "list",
//         name: key,
//         message: object[key],
//         choices: R.map(R.prop(R.__, object), choices),
//       }
//     })
//   )(object)
// })


const createQuestions = R.curry((object = {}) => (
  R.pipe(
    R.filter(R.test(/^question-\d+$/)),
    R.map((key) => {
      const choices = R.filter(R.test(new RegExp(`${key}-choice-\\d+$`)))(R.keys(object));
      return {
        type: "list",
        name: key,
        message: object[key] || '',
        choices: R.map(R.prop(R.__, object))(choices),
      }
    })
  )(R.keys(object))
))

const readFile = path =>
  new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => (err ? reject(err) : resolve(data)))
  })

const writeFile = (path, data) =>
  new Promise((resolve, reject) => {
    fs.writeFile(path, data, err =>
      err ? reject(err) : resolve('File saved successfully')
    )
  })

module.exports = {
  chooseRandom,
  createPrompt,
  createQuestions,
  readFile,
  writeFile
}

