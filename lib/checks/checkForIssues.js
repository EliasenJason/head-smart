export default function checkForIssues(unit) {
  let issues = []
  if (unit.pack1 === 'red' || unit.pack1 ==='yellow' || unit.pack2 === 'red' || unit.pack2 ==='yellow' || unit.pack3 === 'red' || unit.pack3 ==='yellow' || unit.pack4 === 'red' || unit.pack4 ==='yellow' || unit.pack5 === 'red' || unit.pack5 ==='yellow') {
    issues.push('P')
  }
  return issues
}