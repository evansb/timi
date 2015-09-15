
export default () => {
  return {
    restrict: 'E',
    transclude: true,
    template:
      `<div class="timi-slot">
        <div class="row">
          <div class="col col-25">
            <div class="row">
              <div class="col date-big text-center">
                {{ slot.start.format('DD') }}
              </div>
            </div>
            <div class="row">
              <div class="col month-big text-center">
                {{ slot.start.format('MMM') }}
              </div>
            </div>
          </div>
          <div class="col col-50">
            <div class="row">
              <div class="col day-big">
                {{ ((slot.start.calendar().indexOf('/') == - 1)
                    ? slot.start.calendar().split(' ')[0]
                    : slot.start.format('dddd')).toUpperCase()
                }}
              </div>
            </div>
            <div class="row">
              <div class="col">
                {{ slot.start.format('hh:mm') }} - {{ slot.end.format('hh:mm') }}
              </div>
            </div>
          </div>
          <div class="col col-center x-icon">
            <i class="icon ion-close"></i>
          </div>
        </div>
      </div>`
  };
}
