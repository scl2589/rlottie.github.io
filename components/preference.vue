<template>
  <div class="sidebar">
    <p class="title">
      Preference
      <!-- canvas info -->
      <v-chip
        v-if="multiview"
        class="ml-1 mb-1 text-caption"
        color="#0fccce"
        small
      >
        {{canvasid + 1}}
      </v-chip>
    </p>
    
    <!-- background color controller -->
    <div class="preference" v-if="canvasstyle">
      <p class="preference-title mb-2">Background color</p>
      <div class="text-left">
        <v-menu 
          offset-y 
          :close-on-content-click="false"
          >
        <template v-slot:activator="{ on }">
          <v-btn
            :color="canvasstyle.backgroundColor.hex"
            dark
            v-on="on"
            class="mr-2"
          >
          </v-btn>
          <span>{{ canvasstyle.backgroundColor.hex }}</span>
        </template>
        <v-color-picker
          light
          v-model="canvasstyle.backgroundColor"
          show-swatches
          class="mx-auto"
        ></v-color-picker>
        </v-menu>
      </div>
    </div>

    <!-- Canvas Resize -->
    <!-- <div class="d-flex flex-column justify-content-center align-items-start preference">
      <label class="mb-2" for="slider2">Canvas Resize</label>
      <input class="canvasSlider" type="range" id="slider2" min="0" max="100" value="100"
        oninput="onResizeSliderDrag(this.value)">
    </div> -->


    <!-- Dimension controller -->
    <div class="preference" v-if="canvasstyle">
      <p class="preference-title mb-2">Canvas Resize</p>
      <div class="position d-flex">
        <v-text-field
          light
          solo
          prefix="W"
          suffix="px"
          v-model="canvasstyle.width"
          class="mr-3 bg-white"
          hide-details
          @change="changeXDimension"
        ></v-text-field>
        <v-text-field
          light
          solo
          prefix="H"
          suffix="px"
          v-model="canvasstyle.height"
          class="bg-white"
          hide-details
          @change="changeYDimension"
        ></v-text-field>
      </div>
    </div>

    <!-- canvas rotation options -->
    <div class="preference" v-if="canvasstyle">
      <p class="preference-title mb-0">Canvas Rotation</p>
      <div class="row d-flex align-items-center-no-gutters">
        <div class="col-6 pl-1">
          <v-text-field 
            light solo suffix="°"
            @change="changeCanvasRotation(canvasstyle.degree)"
            v-model="canvasstyle.degree"
          ></v-text-field>
        </div>
      </div>
    </div>

    <!-- canvas shape -->
    <div class="preference" v-if="canvasstyle">
      <p class="preference-title mb-2">Canvas Shape</p>
      <v-btn-toggle light v-model="canvasstyle.borderShape" mandatory @change="changeBorderShape">
        <v-btn>
          <v-icon class="fas fa-square-full text-dark"></v-icon>
        </v-btn>
        <v-btn>
          <v-icon class="fas fa-circle text-dark"></v-icon>
        </v-btn>
      </v-btn-toggle>
    </div>

    <!-- border Options -->
    <div class="preference" v-if="canvasstyle">
      <p class="preference-title mb-0">Border</p>
      <div class="row d-flex align-items-center no-gutters">
        <div class="text-left col-6 pr-0">
          <v-menu 
            offset-y 
            :close-on-content-click="false"
            >
          <template v-slot:activator="{ on }">
            <v-btn
              :color="canvasstyle.borderColor.hex"
              dark
              v-on="on"
              class="mr-2"
            >
            </v-btn>
            <span>{{ canvasstyle.borderColor.hex }}</span>
          </template>
          <v-color-picker
            light
            v-model="canvasstyle.borderColor"
            show-swatches
            class="mx-auto"
          ></v-color-picker>
          </v-menu>
        </div>
        <div class="col-6 pl-1">
          <v-text-field
            light
            solo
            suffix="px"
            v-model="canvasstyle.borderWidth"
            class="bg-white"
            hide-details
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
  },
  data: function () {
    return {
    }
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