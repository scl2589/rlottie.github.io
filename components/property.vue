<template>
  <div class="sidebar scroll-sect" :class="{ 'scroll-sect-dark': $vuetify.theme.dark, 'scroll-sect-light': !$vuetify.theme.dark }">
    <p class="title">Property</p>

    <div class="mt-5" v-if="keypathTrigger">
      <p class="font-weight-bold">
        Keypath
        <!-- <v-chip
          v-if="multiview"
          class="ml-2 font-weight-regular"
          color="preview"
          small
        >
          canvas {{canvasid + 1}}
        </v-chip> -->
      </p>
      <p class=" mt-1">
        {{selectedLayer.keypath}} 
      </p>
      <hr v-if="$vuetify.theme.dark" color="white">
      <hr v-else color="gray">
    </div>

    <!-- color controller -->
    <div class="property" v-if="selectedLayer.child.length === 0">
      <p class="property-title mb-2">Color</p>
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
            light
            v-model="selectedLayer.color"
            show-swatches
            class="mx-auto"
        ></v-color-picker>
        </v-menu>
      </div>
    </div>

    <!-- opacity controller -->
    <div class="property mt-7">
      <div class="d-flex align-items-center mb-2">
        <p class="property-title m-0">Opacity</p>
        <v-tooltip bottom nudge-right="65" nudge-bottom="60">
          <template v-slot:activator="{ on, attrs }">
            <i
              class="far fa-question-circle fa-sm ml-2"
              v-bind="attrs"
              v-on="on"
            >
            </i>
          </template>
          <span>Number should be between 0 and 100</span>
        </v-tooltip>
      </div>

      <div class="position d-flex">
        <v-text-field
          light
          solo
          v-model="selectedLayer.opacity"
          placeholder="Opacity"
          class="mr-3"
          @change="changeOpacity(selectedLayer.opacity)"
        ></v-text-field>
      </div>
    </div>

    <!-- position controller -->
    <div class="property">
      <p class="property-title mb-2">Position</p>
      <div class="position d-flex">
        <v-text-field
          light
          solo
          prefix="x"
          v-model="selectedLayer.xPos"
          placeholder="0"
          @change="changeXPos(selectedLayer.xPos)"
          class="mr-3"
        ></v-text-field>
        <v-text-field
          light
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
      <div class="d-flex align-items-center mb-2">
        <p class="property-title m-0">Scale</p>
        <v-tooltip bottom nudge-right="100" nudge-bottom="60">
          <template v-slot:activator="{ on, attrs }">
            <i
              class="far fa-question-circle fa-sm ml-2"
              v-bind="attrs"
              v-on="on"
            >
            </i>
          </template>
          <span>Number should be greater than or equal to 0</span>
        </v-tooltip>
      </div>
      
      <div class="preference">
        <div class="position d-flex">
          <v-text-field
            light
            solo
            prefix="W"
            v-model="selectedLayer.scaleWidth"
            class="mr-3"
            @change="changeScaleWidth(selectedLayer.scaleWidth)"
            placeholder="100"
          ></v-text-field>
          <v-text-field
            light
            solo
            prefix="H"
            v-model="selectedLayer.scaleHeight"
            @change="changeScaleHeight(selectedLayer.scaleHeight)"
            placeholder="100"
          ></v-text-field>
        </div>
      </div>
    </div>

    <!-- rotation controller -->
    <div class="property">
      <div class="d-flex align-items-center mb-2">
        <p class="property-title m-0">Rotation</p>
        <v-tooltip bottom nudge-right="60" nudge-bottom="60">
          <template v-slot:activator="{ on, attrs }">
            <i
              class="far fa-question-circle fa-sm ml-2"
              v-bind="attrs"
              v-on="on"
            >
            </i>
          </template>
          <span>Number should be between 0 and 360</span>
        </v-tooltip>
      </div>
      <div class="rotation m-0">
         <v-text-field
          light
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
      keypathTrigger: true,
    }
  },
  props: {
    selectedLayer: Object,
    canvasid: Number,
    multiview: Boolean,
    trigger: Boolean,
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
    },
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
          setLayerColor(this.selectedLayer, r, g, b, this.canvasid);
        }
      }
    },
    trigger() {
      if (this.multiview) {
        this.keypathTrigger = false
      }
    },
    selectedLayer() {
      this.keypathTrigger = true
    },
  },
  methods: {
    changeOpacity(opacity) {
      if (opacity && opacity <= 100 && opacity >= 0) {
        if (this.selectedLayer.visible) {
          setLayerOpacity(this.selectedLayer, Number(opacity), this.canvasid);
          // setLayerOpacity( this.selectedLayer.keypath + ".**", Number(opacity), this.canvasid, 'Stroke');
        }
      }
    },
    changeScaleWidth(scaleWidth) {
      if (scaleWidth >= 0) {
        if (this.selectedLayer.scaleHeight) {
          if (this.selectedLayer.scaleHeight >= 0) {
            setScale(this.selectedLayer, Number(scaleWidth), Number(this.selectedLayer.scaleHeight), this.canvasid)
          }
        } else {
          setScale(this.selectedLayer, Number(scaleWidth), 100, this.canvasid)
        }
      }
    },
    changeScaleHeight(scaleHeight) {
      if (scaleHeight >= 0) {
         if (this.selectedLayer.scaleWidth) {
           if (this.selectedLayer.scaleWidth >= 0) {
             setScale(this.selectedLayer, Number(this.selectedLayer.scaleWidth), Number(scaleHeight), this.canvasid)
           }
        } else {
          setScale(this.selectedLayer, 100, Number(scaleHeight), this.canvasid)
        }
      }
    },
    changeXPos(xPos) {
      if (this.selectedLayer.yPos) {
        setPosition(this.selectedLayer, Number(xPos), Number(this.selectedLayer.yPos), this.canvasid)
      } else {
        setPosition(this.selectedLayer, Number(xPos), 0, this.canvasid)
      }
    },
    changeYPos(yPos) {
      if (this.selectedLayer.xPos) {
         setPosition(this.selectedLayer, Number(this.selectedLayer.xPos), Number(yPos), this.canvasid)
      } else {
        setPosition(this.selectedLayer, 0, Number(yPos), this.canvasid)
      }
    },
    changeRotation(rotationDegree) {
      if (rotationDegree >= 0 && rotationDegree <= 360) {
        setRotation(this.selectedLayer, Number(rotationDegree), this.canvasid)
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

.v-text-field__prefix, .v-text-field__suffix {
  color: rgba(15, 128, 170, 0.77);
}

.v-messages.theme--light {
  color: white !important;
}

.v-input {
  width: 50% !important;
}

.v-tooltip__content {
  font-size: 10px !important;
}

/* scroll */
.scroll-sect {
  overflow-y: scroll; 
  height: 92vh;
}
</style>