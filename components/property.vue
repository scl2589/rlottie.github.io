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
              :color="color"
              dark
              v-on="on"
              class="mr-2"
            >
            </v-btn>
            <span>{{ color }}</span>
          </template>
          <v-color-picker
            value="#7417BE"
            v-model="color"
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
      color: "#FFFFFF",
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
    },
    // changeColor(color) {
    //   setFillColor(this.selectedLayer.name + ".**", color.rgba.r/255, color.rgba.g/255, color.rgba.b/255);
    //   setStrokeColor(this.selectedLayer.name + ".**", color.rgba.r/255, color.rgba.g/255, color.rgba.b/255);
    // }
  },
  watch: {
    color() {
      var hex = this.color.replace( "#", "" ); 
      var value = hex.match( /[a-f\d]/gi ); 
      value = hex.match( /[a-f\d]{2}/gi ); 
      var r = parseInt( value[0], 16 )/255; 
      var g = parseInt( value[1], 16 )/255; 
      var b = parseInt( value[2], 16 )/255; 
      setFillColor(this.selectedLayer.name + ".**", r, g, b);
      setStrokeColor(this.selectedLayer.name + ".**", r, g, b);
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