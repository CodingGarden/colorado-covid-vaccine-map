<template>
  <div class="home">
     <l-map v-model="zoom" v-model:zoom="zoom" :center="[39.02777480385033, -105.53715747829405]">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      ></l-tile-layer>
      <l-marker
        v-for="provider in providers"
        :key="provider.address"
        :lat-lng="[provider.location.latitude, provider.location.longitude]"
      >
        <l-icon
          icon-url="https://cdn.frankerfacez.com/static/emoji/images/twemoji/1f489.png"
          :icon-size="[45, 45]"
        />
        <l-popup>
          <h1>{{provider.name}}</h1>
          <h3>{{provider.address}}</h3>
          <div v-html="cleanupDescription(provider)"></div>
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import {
  LMap, LIcon, LMarker, LTileLayer, LPopup,
} from '@vue-leaflet/vue-leaflet';
import { ref } from 'vue';
import places from '../places';

const validPlaces = places.filter(
  (place) => place.location.latitude && place.location.longitude,
);

export default {
  name: 'Home',
  components: {
    LMap,
    LTileLayer,
    LIcon,
    LMarker,
    LPopup,
  },
  setup() {
    const zoom = ref(7);

    function cleanupDescription(place) {
      return place.description.split('unnamed')[0];
    }

    return {
      zoom,
      providers: validPlaces,
      cleanupDescription,
    };
  },
};
</script>

<style lang="scss">
.home {
  width: 100%;
  height: 100%;
}
</style>
