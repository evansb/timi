
export default () => {
  return {
    restrict: 'E',
    transclude: true,
    template:
      `<div class="timi-event-card" ng-click="goToDetails(event)">
        <div class="item item-text-wrap">
          <h2>{{ event.title }}</h2>
          <div ng-if="event.type == 'pending'">
            <p>{{ event.inviter }}</p>
          </div>
          <div ng-if="event.type == 'confirmed'">
            <p>{{ event.date }} {{ event.timeStart }} - {{event.timeEnd}} </p>
          </div>
        </div>
      </div>`
  };
}