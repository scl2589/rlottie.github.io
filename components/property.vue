<template>
  <div class="bg-sidebar sidebar">
    <p class="title">Property</p>
    
    <!-- color controller -->
    <div class="property">
      <p class="property-title">Color</p>
      <div class="text-left">
        <v-menu
          offset-y 
          :close-on-content-click="false"
          >
          <template v-slot:activator="{ on }">
            <v-btn
              :color="selectedLayer.color.hex"
              dark
              v-on="on"
              class="mr-2"
            >
            </v-btn>
            <span>{{ selectedLayer.color.hex }}</span>
          </template>
          <v-color-picker
            v-model="selectedLayer.color"
            show-swatches
            class="mx-auto"
        ></v-color-picker>
        </v-menu>
      </div>
    </div>

    <!-- opacity controller -->
    <div class="property">
      <p class="property-title">Opacity</p>
      <div class="position d-flex">
        <v-text-field
          solo
          v-model="selectedLayer.opacity"
          placeholder="Opacity"
          hint="The number should be in between 0 and 100!"
          class="mr-3"
          @change="changeOpacity(selectedLayer.opacity)"
        ></v-text-field>
      </div>
    </div>

    <!-- position controller -->
    <div class="property">
      <p class="property-title">Position</p>
      <div class="position d-flex">
        <v-text-field
          solo
          prefix="x"
          v-model="xPos"
          class="mr-3"
        ></v-text-field>
        <v-text-field
          solo
          prefix="y"
          v-model="yPos"
        ></v-text-field>
      </div>
    </div>

    <!-- scale controller -->
    <div class="property">
      <p class="property-title">Scale</p>
      <div class="scale">
        <v-text-field
          solo
          suffix="%"
          v-model="scale"
        ></v-text-field>
      </div>
    </div>
  </div>
  
</template>

<script>
module.exports = {
  name: 'property',
  data: function () {
    return {
      xPos: 250,
      yPos: 250,
      scale: 100,
      opacity: 100,
      valid: true,
      lazy: false,
    }
  },
  props: {
    selectedLayer: Object,
  },
  computed: {
    swatchStyle() {
      const { color, menu } = this
      return {
        backgroundColor: color,
        cursor: 'pointer',
        height: '30px',
        width: '30px',
        borderRadius: menu ? '50%' : '4px',
        transition: 'border-radius 200ms ease-in-out'
      }
    }
  },
  methods: {
    changeOpacity(opacity) {
      if (opacity && opacity <= 100 && opacity >= 0) {
        setFillOpacity( this.selectedLayer.name + ".**", Number(opacity));
        setStrokeOpacity( this.selectedLayer.name + ".**", Number(opacity));
      }
    }
  },
  watch: {
    selectedLayer: {
      deep: true,
      handler() {
        if (this.selectedLayer.color.hex !== String()) {
          var currentLayerColor = this.selectedLayer.color
          r = currentLayerColor.rgba.r / 255;
          g = currentLayerColor.rgba.g / 255;
          b = currentLayerColor.rgba.b / 255;
          setFillColor(this.selectedLayer.name + ".**", r, g, b);
          setStrokeColor(this.selectedLayer.name + ".**", r, g, b);
        }
      }
    }
  }
}
</script>

<style scoped>
.sidebar {
  padding: 1.2rem;
}

p {
  margin: 0;
}

.title {
  font-size: 1.5rem;
}

.property {
  margin: 20px 0 0 0;
}

.property-title {
  margin-bottom: 10px;
}

.v-text-field__prefix, .v-text-field__suffix {
  color: rgba(15, 128, 170, 0.77);
}

.v-messages.theme--light {
  color: white !important;
}
</style>