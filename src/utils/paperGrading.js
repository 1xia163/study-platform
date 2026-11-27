const missingAnswers = new Set(['', '无', '暂无答案', '暂无参考答案', '无参考答案'])

export function hasReferenceAnswer(answer) {
  if (Array.isArray(answer)) {
    return answer.length > 0 && answer.every(hasReferenceAnswer)
  }
  return answer != null && !missingAnswers.has(String(answer).trim())
}

export function objectiveAnswer(question) {
  const { type, answer, options } = question
  if (!hasReferenceAnswer(answer)) return null

  if (type === '判断') {
    if (['T', '正确', true].includes(answer)) return 'T'
    if (['F', '错误', false].includes(answer)) return 'F'
    return null
  }

  const validOption = (value) =>
    typeof value === 'string' &&
    /^[A-Z]$/.test(value) &&
    (!options?.length || value.charCodeAt(0) - 65 < options.length)

  if (type === '单选' && validOption(answer)) return answer

  if (
    type === '多选' &&
    Array.isArray(answer) &&
    answer.every(validOption) &&
    new Set(answer).size === answer.length
  ) {
    return answer
  }

  return null
}

export function summarizeGrading(grading) {
  let score = 0
  let fullScore = 0
  let wrongCount = 0
  let pendingCount = 0
  let reviewScore = 0
  let reviewFullScore = 0

  for (const result of Object.values(grading)) {
    switch (result.status) {
      case 'correct':
      case 'wrong':
        score += result.score
        fullScore += result.maxScore
        if (result.status === 'wrong') wrongCount++
        break
      case 'pending':
        pendingCount++
        break
      case 'reviewed':
        reviewScore += result.score
        reviewFullScore += result.maxScore
        break
    }
  }

  return {
    grading,
    score,
    fullScore,
    wrongCount,
    pendingCount,
    reviewScore,
    reviewFullScore,
    reviewStatus: pendingCount > 0 ? 'pending' : 'complete',
  }
}

export function gradePaper(paper) {
  const grading = Object.fromEntries(
    (paper.questions ?? []).map((question) => {
      const expected = objectiveAnswer(question)
      const actual = paper.userAnswer?.[question.id]
      const points = Number(question.score)
      const maxScore = Number.isFinite(points) && points >= 0 ? points : 0

      if (expected === null) {
        const status =
          question.type === '主观' && hasReferenceAnswer(question.answer) ? 'reference' : 'pending'
        return [question.id, { status, score: null, maxScore }]
      }

      const correct = Array.isArray(expected)
        ? Array.isArray(actual) &&
          actual.length === expected.length &&
          expected.every((option) => actual.includes(option))
        : actual === expected

      return [
        question.id,
        { status: correct ? 'correct' : 'wrong', score: correct ? maxScore : 0, maxScore },
      ]
    })
  )

  return summarizeGrading(grading)
}

export function readPaperGrading(paper) {
  return paper.grading ? summarizeGrading(paper.grading) : gradePaper(paper)
}
