
export default () => {
  return {
    restrict: 'E',
    transclude: true,
    template:
      `<div class="timi-person-card">
        <div class="row">
          <div class="item item-checkbox">
            <label class="checkbox">
              <input type="checkbox">
            </label>
            {{ participant.name }}
          </div>
        </div>
      </div>`
  };
}