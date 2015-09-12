
export default {
  name: 'timiFullButton',
  fn: () => {
    return {
      restrict: 'E',
      templateUrl: 'views/components/timi-full-button.html',
      transclude: true,
      scope: {
        label: '@',
        type: '@'
      }
    };
  }
};
