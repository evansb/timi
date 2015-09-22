/* Merge overlapping intervals
 *
 * Example:
 * [[1,4],[3,5],[2,4],[7,10]] -> [[1,5],[7,10]]
 */
function mergeIntervals(intervals) {
  // test if there are at least 2 intervals
  if(intervals.length <= 1)
    return intervals;

  var stack = [];
  var top   = null;

  // sort the intervals based on their start values
  intervals = intervals.sort();

  // push the 1st interval into the stack
  stack.push(intervals[0]);

  // start from the next interval and merge if needed
  for (var i = 1; i < intervals.length; i++) {
    // get the top element
    top = stack[stack.length - 1];

    // if the current interval doesn't overlap with the
    // stack top element, push it to the stack
    if (top[1] < intervals[i][0]) {
      stack.push(intervals[i]);
    }
    // otherwise update the end value of the top element
    // if end of current interval is higher
    else if (top[1] < intervals[i][1])
    {
      top[1] = intervals[i][1];
      stack.pop();
      stack.push(top);
    }
  }

  return stack;
}

module.exports = mergeIntervals;
