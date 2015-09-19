
export default () => {
  return {
    restrict: 'E',
    transclude: true,
    template:
      `<div class="timi-event-header">
        <div class='header text-center'>
          <h3 class='energized'>Date with Sharon</h3>
        </div>
        <div class="row stripe">
          <div class="col col-10 text-center">
            <i class="icon ion-ios-location"></i>
          </div>
          <div class="col">Aircon Canteen</div>
        </div>
        <div class="row">
          <div class="col col-10 text-center">
            <i class="icon ion-android-person"></i>
          </div>
          <div class="col">Sharon</div>
        </div>
        <div class="row">
          <div class="col col-50">
            {{ going.length }} Going
          </div>
          <div class="col">
            {{ invited.length }} Pending
          </div>
        </div>
      </div>`
  };
}
