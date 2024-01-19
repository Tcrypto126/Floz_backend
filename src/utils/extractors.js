// function extractCost(text) {
//   console.log(`text: ${text}`);
//   // Look for a currency symbol followed by numbers
//   const costRegex = /\$\s*\d+(?:,\d{3})*(?:\.\d{2})?/g;
//   const costs = text.match(costRegex);
//   return costs ? costs.map((cost) => cost.trim()) : [];
// }

function extractCost(text) {
  // console.log(`text: ${text}`);
  // Look for a currency symbol followed by numbers
  const costRegex = /\$\s*\d+(?:,\d{3})*(?:\.\d{2})?/g;
  const costs = text.match(costRegex);
  return costs ? costs.map((cost) => cost.trim()) : null;
}

function extractDeadline(text) {
  // Look for dates in the format mm/dd/yyyy or yyyy/mm/dd
  const deadlineRegex =
    /\b(?:\d{1,2}\/\d{1,2}\/\d{4}|\d{4}\/\d{1,2}\/\d{1,2})\b/g;
  const deadlines = text.match(deadlineRegex);
  return deadlines ? deadlines.map((deadline) => deadline.trim()) : [];
}

function extractTodoList(text) {
  // Assuming to-dos are in bullet points or numbered lists
  const todoRegex = /\n/g;
  const todos = [];
  let match;
  while ((match = todoRegex.exec(text)) !== null) {
    todos.push(match[1].trim());
  }
  return todos;
}

module.exports = {
  extractCost,
  extractDeadline,
  extractTodoList,
};
