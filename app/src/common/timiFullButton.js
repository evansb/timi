
export default () => {
  return {
    scope: {
      color: '@',
      type: '@'
    },
    restrict: 'E',
    transclude: true,
    templateUrl: __dirname + '/timi-full-button.html'
  };
}
