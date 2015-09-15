
export default () => {
  return {
    scope: {
      color: '@',
      type: '@'
    },
    restrict: 'E',
    transclude: true,
    template:
      `<div class="row timi-full-button">
        <div class="col text-center">
          <button class="button button-{{color}}" type="{{type}}">
            <div ng-transclude></div>
          </button>
        </div>
      </div>`
  };
}
