<template>
  <div
    class="sidebar scroll-sect"
    :class="{ 'scroll-sect-dark': $vuetify.theme.dark, 'scroll-sect-light': !$vuetify.theme.dark }"
  >
    <p class="title">
      Property
      <!-- canvas info -->
      <v-chip
        class="ml-1 mb-1 text-caption"
        v-if="multiview"
        color="canvas"
        small
      >
        {{canvasid + 1}}
      </v-chip>
    </p>

    <!-- keypath info -->
    <div class="mt-5">
      <p class="font-weight-medium">
        Keypath
      </p>
      <p class="ml-1 mt-2">
        {{selectedLayer.keypath}} 
      </p>
      <hr
        v-if="$vuetify.theme.dark"
        color="white"
      >
      <hr
        v-else
        color="gray"
      >
    </div>

    <!-- color controller -->
    <div class="property mt-7">
      <p class="property-title mb-2">Color</p>
      <div
        class="text-left d-flex align-items-center"
        v-if="selectedLayer.child.length !== 0"
        @click="clickColorError"
      >
        <v-menu
          disabled
          offset-y
          :close-on-content-click="false"
          >
          <template v-slot:activator="{ on }">
            <v-btn
              class="mr-2"
              :color="selectedLayer.color.hex"
              dark
              v-on="on"
            >
            </v-btn>
            <span>{{ selectedLayer.color.hex }}</span>
          </template>
          <v-color-picker
            class="mx-auto"
            light
            show-swatches
            v-model="selectedLayer.color"
        ></v-color-picker>
        </v-menu>
        <small
          class="error-text"
          v-if="isColorError"
        >
          Access deeper layer to change color property.
        </small>
        <small v-else>This layer does not have color property.</small>
      </div>

      <div
        class="text-left"
        v-else
      >
        <v-menu
          offset-y
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              class="mr-2"
              :color="selectedLayer.color.hex"
              dark
              v-on="on"
            >
            </v-btn>
            <span>{{ selectedLayer.color.hex }}</span>
          </template>
          <v-color-picker
            class="mx-auto"
            light
            show-swatches
            v-model="selectedLayer.color"
        ></v-color-picker>
        </v-menu>
      </div>
    </div>

    <!-- opacity controller -->
    <div class="property mt-8">
      <div class="d-flex align-items-center mb-2">
        <p class="property-title m-0">Opacity</p>
        <v-tooltip
          bottom nudge-right="65"
          nudge-bottom="60"
        >
          <template v-slot:activator="{ on, attrs }">
            <em
              class="far fa-question-circle fa-sm ml-2"
              v-bind="attrs"
              v-on="on"
            >
            </em>
          </template>
          <span>Number should be between 0 and 100</span>
        </v-tooltip>
      </div>
      <div class="position row no-gutters">
        <v-text-field
          class="mr-3 col-12 col-md-6"
          light
          solo
          v-model="selectedLayer.opacity"
          placeholder="Opacity"
          suffix="%"
          @change="changeOpacity(selectedLayer.opacity)"
        ></v-text-field>
      </div>
    </div>

    <!-- stroke width controller -->
    <div
      class="property"
      v-show="selectedLayer.child.length == 0 && selectedLayer.type == 'Stroke'"
    >
      <div class="d-flex align-items-center mb-2">
        <p class="property-title m-0">Stroke Width</p>
        <v-tooltip
          bottom
          nudge-right="50"
          nudge-bottom="60"
        >
          <template v-slot:activator="{ on, attrs }">
            <em
              class="far fa-question-circle fa-sm ml-2"
              v-bind="attrs"
              v-on="on">
            </em>
          </template>
          <span>Number should be greater than or equal to 0</span>
        </v-tooltip>
      </div>
        <div class="position row no-gutters">
          <v-text-field
            class="mr-3 col-12" 
            light 
            solo 
            v-model="selectedLayer.strokeWidth" 
            placeholder="width" 
            suffix="px"
            @change="changeStrokeWidth"
          ></v-text-field>
        </div>
    </div>

    <!-- position controller -->
    <div
      class="property"
      v-show="selectedLayer.child.length > 0"
    >
      <div class="d-flex align-items-center mb-2">
        <p class="property-title m-0">Position</p>
        <v-tooltip
          bottom
          nudge-right="100"
          nudge-bottom="60"
          max-width="350"
        >
          <template v-slot:activator="{ on, attrs }">
            <em
              class="far fa-question-circle fa-sm ml-2"
              v-bind="attrs"
              v-on="on"
            >
            </em>
          </template>
          <span>X axis and Y axis directions are relative concepts that can differ depending on the file</span>
        </v-tooltip>
      </div>
      <div class="position d-flex">
        <v-text-field
          class="mr-3"
          light
          solo
          v-model="selectedLayer.xPos"
          prefix="X"
          suffix="px"
          placeholder="0"
          @change="changeXPos(selectedLayer.xPos)"
        ></v-text-field>
        <v-text-field
          light
          solo
          v-model="selectedLayer.yPos"
          prefix="Y"
          suffix="px"
          placeholder="0"
          @change="changeYPos(selectedLayer.yPos)"
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
      isColorError: false
    }
  },
  props: {
    selectedLayer: Object,
    canvasid: Number,
    multiview: Boolean,
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
          let r = currentLayerColor.rgba.r / 255;
          let g = currentLayerColor.rgba.g / 255;
          let b = currentLayerColor.rgba.b / 255;
          setLayerColor(this.selectedLayer, r, g, b, this.canvasid);
        }
        this.isColorError = false
      }
    }
  },
  methods: {
    changeOpacity(opacity) {
      if (opacity && opacity <= 100 && opacity >= 0) {
        if (this.selectedLayer.visible) {
          setLayerOpacity(this.selectedLayer, Number(opacity), this.canvasid);
        }
      }
    },
    changeStrokeWidth(width) {
      setStrokeWidth(this.selectedLayer, Number(width), this.canvasid);
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
    clickColorError() {
      this.isColorError = true
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

.error-text {
  color: rgb(255, 94, 94);
}
</style>