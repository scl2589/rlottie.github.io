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
            <span>{{color.slice(0, 7)}}</span>
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
  </div>
  
</template>

<script>
module.exports = {
  name: 'property',
  data: function () {
    return {
      color: 'pink',
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

.v-input {
  width: 50% !important;
}
</style>