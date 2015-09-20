
export default () => {
  return {
    restrict: 'E',
    transclude: true,
    template:
      `<div class="timi-event-card" ng-click="goToDetails(event)">
        <div class="item item-text-wrap">
          <h2>{{ event.name }}</h2>
          <div ng-if="event.isPending">
            <p>
              <i class="icons ion-person"></i>
              {{ event.owner.name }}
            </p>
            <p>
              <i class="icons ion-ios-stopwatch"></i>
              {{ event.deadline }}
            </p>
          </div>
          <div ng-if="event.type == 'confirmed'">
            <p>{{ event.date }} {{ event.timeStart }} - {{event.timeEnd}} </p>
          </div>
        </div>
      </div>`
  };
}
