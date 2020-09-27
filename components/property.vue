<template>
  <div class="bg-sidebar sidebar scroll-sect">
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
          v-model="selectedLayer.xPos"
          placeholder="0"
          @change="changeXPos(selectedLayer.xPos)"
          class="mr-3"
        ></v-text-field>
        <v-text-field
          solo
          prefix="y"
          v-model="selectedLayer.yPos"
          placeholder="0"
          @change="changeYPos(selectedLayer.yPos)"
        ></v-text-field>
      </div>
    </div>

    <!-- scale controller -->
    <div class="property">
      <p class="property-title">Scale</p>
      <div class="preference">
        <div class="position d-flex">
          <v-text-field
            solo
            prefix="W"
            v-model="selectedLayer.scaleWidth"
            class="mr-3"
            @change="changeScaleWidth(selectedLayer.scaleWidth)"
            hint="The number should be greater and equal to 0 "
            placeholder="100"
          ></v-text-field>
          <v-text-field
            solo
            prefix="H"
            v-model="selectedLayer.scaleHeight"
            @change="changeScaleHeight(selectedLayer.scaleHeight)"
            placeholder="100"
            hint="The number should be greater than or equal to 0 "
          ></v-text-field>
        </div>
      </div>
    </div>

    <!-- rotation controller -->
    <div class="property m-0">
      <p class="property-title">Rotation</p>
      <div class="rotation m-0">
         <v-text-field
          solo
          suffix="°"
          @change="changeRotation(selectedLayer.rotation)"
          v-model="selectedLayer.rotation"
          :placeholder="selectedLayer.rotation"
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
    },
  },
  methods: {
    changeOpacity(opacity) {
      if (opacity && opacity <= 100 && opacity >= 0) {
        if (this.selectedLayer.visible) {
          setFillOpacity( this.selectedLayer.name + ".**", Number(opacity));
          setStrokeOpacity( this.selectedLayer.name + ".**", Number(opacity));
        }
      }
    },
    changeScaleWidth(scaleWidth) {
      if (scaleWidth >= 0) {
        if (this.selectedLayer.scaleHeight) {
          if (this.selectedLayer.scaleHeight >= 0) {
            setScale(this.selectedLayer.name + ".**", Number(scaleWidth), Number(this.selectedLayer.scaleHeight))
          }
        } else {
          setScale(this.selectedLayer.name + ".**", Number(scaleWidth), 100)
        }
      }
    },
    changeScaleHeight(scaleHeight) {
      if (scaleHeight >= 0) {
         if (this.selectedLayer.scaleWidth) {
           if (this.selectedLayer.scaleWidth >= 0) {
             setScale(this.selectedLayer.name + ".**", Number(this.selectedLayer.scaleWidth), Number(scaleHeight))
           }
        } else {
          setScale(this.selectedLayer.name + ".**", 100, Number(scaleHeight))
        }
      }
    },
    changeXPos(xPos) {
      if (this.selectedLayer.yPos) {
        setPosition(this.selectedLayer.name + ".**", Number(xPos), Number(this.selectedLayer.yPos))
      } else {
        setPosition(this.selectedLayer.name + ".**", Number(xPos), 0)
      }
    },
    changeYPos(yPos) {
      if (this.selectedLayer.xPos) {
         setPosition(this.selectedLayer.name + ".**", Number(this.selectedLayer.xPos), Number(yPos))
      } else {
        setPosition(this.selectedLayer.name + ".**", 0, Number(yPos))
      }
    },
    changeRotation(rotationDegree) {
      if (rotationDegree >= 0 && rotationDegree <= 360) {
        setRotation(this.selectedLayer.name + ".**", Number(rotationDegree))
      }
    },
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
  margin: 10px 0 0 0;
}

.property-title {
  margin-bottom: 10px;
}

.rotation {
  margin: 20px 0 0 0;
}

.v-text-field__prefix, .v-text-field__suffix {
  color: rgba(15, 128, 170, 0.77);
}

.v-messages.theme--light {
  color: white !important;
}

.v-input {
  width: 50% !important;
}


/* scroll */
.scroll-sect {
  overflow-y: scroll; 
}

.scroll-sect::-webkit-scrollbar {
  width: 8px; 
  height: 8px;
}

.scroll-sect::-webkit-scrollbar-track {
  background: #1D3557;
  border-radius: 15px;
}

.scroll-sect::-webkit-scrollbar-corner {
  background: #1D3557; 
}

.scroll-sect::-webkit-scrollbar-thumb {
  background: rgba(15, 128, 170);
}

.scroll-sect::-webkit-scrollbar-button {
  background-color: red;
  height: 0;
}

</style>