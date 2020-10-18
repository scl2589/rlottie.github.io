<template>
  <div 
    class="sidebar scroll-sect"
    :class="{ 'scroll-sect-dark': $vuetify.theme.dark, 'scroll-sect-light': !$vuetify.theme.dark }"
  >
    <p class="title">
      Preference
      <!-- canvas info -->
      <v-chip
        v-if="multiview"
        class="ml-1 mb-1 text-caption"
        color="canvas"
        small
      >
        {{canvasid + 1}}
      </v-chip>
    </p>
    
    <!-- background color controller -->
    <div 
      class="preference" 
      v-if="canvasstyle"
    >
      <p class="preference-title mb-2">Background Color</p>
      <div class="text-left">
        <v-menu 
          offset-y 
          :close-on-content-click="false"
          >
        <template v-slot:activator="{ on }">
          <v-btn
            class="mr-2"
            :color="canvasstyle.backgroundColor.hex"
            dark
            v-on="on"
          >
          </v-btn>
          <span>{{ canvasstyle.backgroundColor.hex }}</span>
        </template>
        <v-color-picker
          class="mx-auto"
          light
          show-swatches
          v-model="canvasstyle.backgroundColor"
        ></v-color-picker>
        </v-menu>
      </div>
    </div>


    <!-- Dimension controller -->
    <div 
      class="preference" 
      v-if="canvasstyle"
    >
      <p class="preference-title mb-2">Canvas Resize</p>
      <div class="position d-flex">
        <v-text-field
          class="mr-3 bg-white"
          light
          solo
          hide-details
          v-model="canvasstyle.width"
          prefix="W"
          suffix="px"
          @change="changeXDimension"
        ></v-text-field>
        <v-text-field
          class="bg-white"
          light
          solo
          hide-details
          v-model="canvasstyle.height"
          prefix="H"
          suffix="px"
          @change="changeYDimension"
        ></v-text-field>
      </div>
    </div>

    <!-- canvas rotation controller -->
    <div 
      class="preference" 
      v-if="canvasstyle"
    >
      <p class="preference-title mb-2">Canvas Rotation</p>
      <div class="row align-items-center no-gutters">
        <div class="col-12 col-md-4">
          <v-text-field 
            light 
            solo 
            hide-details
            v-model="canvasstyle.degree"
            suffix="°"
            @change="changeCanvasRotation(canvasstyle.degree)"
          ></v-text-field>
        </div>
        <v-spacer></v-spacer>
        <v-slider
          class="col-12 col-md-7"
          hide-details
          v-model="canvasstyle.degree"
          max="360"
          color="preview"
          @change="changeCanvasRotation(canvasstyle.degree)"
        ></v-slider>
      </div>
    </div>

    <!-- canvas shape -->
    <div 
      class="preference" 
      v-if="canvasstyle"
    >
      <p class="preference-title mb-2">Canvas Shape</p>
      <v-btn-toggle 
        light 
        mandatory 
        v-model="canvasstyle.borderShape" 
        @change="changeBorderShape"
      >
        <v-btn>
          <v-icon class="fas fa-square-full text-dark"></v-icon>
        </v-btn>
        <v-btn>
          <v-icon class="fas fa-circle text-dark"></v-icon>
        </v-btn>
      </v-btn-toggle>
    </div>

    <!-- border options -->
    <div 
      class="preference" 
      v-if="canvasstyle"
    >
      <p class="preference-title mb-0">Border</p>
      <div class="row align-items-center no-gutters">
        <!-- border color -->
        <div class="col-12 col-md-8 mb-2 mb-md-0">
          <v-menu 
            offset-y 
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ on }">
              <v-btn
                class="mr-2"
                dark
                :color="canvasstyle.borderColor.hex"
                v-on="on"
              >
              </v-btn>
              <span>{{ canvasstyle.borderColor.hex }}</span>
            </template>
            <v-color-picker
              class="mx-auto"
              light
              show-swatches
              v-model="canvasstyle.borderColor"
            ></v-color-picker>
          </v-menu>
        </div>
        <v-spacer></v-spacer>
        <!-- border width -->
        <div class="col-12 col-md-4">
          <v-text-field
            class="bg-white"
            light
            solo
            hide-details
            v-model="canvasstyle.borderWidth"
            suffix="px"
            @change="changeBorderWidth"
          ></v-text-field>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: 'preference',
  props: {
    canvasid: Number,
    canvas: Object,
    canvasstyle: Object,
    multiview: Boolean,
    defaultwidth: Number,
    defaultheight: Number,
  },
  watch: {
    canvasstyle: {
      deep: true,
      handler() {
        this.canvas.style.backgroundColor = this.canvasstyle.backgroundColor.hex
        this.canvas.style.borderColor = this.canvasstyle.borderColor.hex
      }
    }
  },
  methods: {
    changeXDimension() {
      this.canvas.style.width = this.canvasstyle.width + "px"
    },
    changeYDimension() {
      this.canvas.style.height = this.canvasstyle.height + "px"
    },
    changeBorderWidth() {
      this.canvas.style.borderWidth = this.canvasstyle.borderWidth + "px"
    },
    changeBorderShape() {
      if (this.canvasstyle.borderShape) {
        this.canvas.style.borderRadius = "50%"
      } else {
        this.canvas.style.borderRadius = 0
      }
    },
    changeCanvasRotation(degree) {
      this.canvas.style.transform = `rotate(${degree}deg)`;
    }
  }
}
</script>

<style scoped>
  .sidebar {
    padding: 1.2rem;
    height: 92vh;
    overflow-y: scroll;
  }

  p {
    margin: 0;
  }

  .title {
    font-size: 1.5rem;
  }

  .preference {
    margin: 20px 0 0 0;
  }

  .preference-title {
    margin-bottom: 10px;
  }

  .v-text-field__prefix, .v-text-field__suffix {
    color: rgba(15, 128, 170, 0.77);
  }

  .canvasSlider {
    width: 100%;
  }
</style>