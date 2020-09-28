<template>
  <div class="sidebar left-sidebar">
    <!-- preview -->
    <div class="preview container py-3 d-flex align-items-center" @click="clickMain">
      <div class="row no-gutters">
        <div class="col-3 d-flex justify-content-center align-items-center">
          <img class="img-thumbnail preview-thumbnail" src="../static/logo.png" alt="preview">
        </div>
        <div class="col-9 d-flex align-items-center">
          <h5 class="ml-4 name mb-0 text-white" id="contentName">FileName</h5>
        </div>
      </div>
    </div>

    <v-tabs
      fixed-tabs
      background-color="sidebar"
      color="text"
      v-model="tab"
    >
      <v-tabs-slider color="preview"></v-tabs-slider>
      <v-tab>
        Layers
      </v-tab>
      <v-tab>
        Add Layers
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <!-- layers tab -->
      <v-tab-item>
        <v-card color="sidebar" flat>
          <!-- search bar -->
          <div class="search-bar container py-3">
            <p class="title">Search layer</p>
            <div class="row no-gutters">
              <button @click="getSearchResult" class="btn col-2"><i class="fas fa-search fa-lg" :class="{ 'text-white': $vuetify.theme.dark }"></i></button>
              <input v-model="searchKeyword" @keypress.enter="getSearchResult" type="text" class="searchInput rounded-pill col-10 px-3 bg-white">
            </div>
          </div>
          <!-- layers -->
          <div class="d-flex justify-content-between align-items-center px-3">
            <p class="title layers-title ">Layers</p>
            <div v-if="layers" class="d-flex justify-content-start align-items-center">
              <v-tooltip bottom nudge-top="10">
                <template v-slot:activator="{ on, attrs }">
                  <button @click="changeAllVisibility" class="eye-btn btn" v-bind="attrs" v-on="on">
                    <i v-if="allLayersVisible" class="far fa-eye" :class="{ 'text-white': $vuetify.theme.dark }"></i>
                    <i v-else class="far fa-eye-slash" :class="{ 'text-white': $vuetify.theme.dark }"></i>
                  </button>
                </template>
                <span v-if="allLayersVisible">Make all layers invisible</span>
                <span v-else>Make all layers visible</span>
              </v-tooltip>
            </div>
          </div>
          <!-- layer list -->
          <div class="layer-list container py-3 px-0"  :class="{ 'scroll-sect-dark': $vuetify.theme.dark, 'scroll-sect-light': !$vuetify.theme.dark }">
            <div v-for="(layer, idx) in layers" :key="idx">
              <div class="row no-gutters py-3 px-3 rounded" :class="{ 'accent': layer.selected }">
                <div @click="clickLayer(layer)" class="layer-info row no-gutters col-10">
                  <div class="col-4 d-flex justify-content-center align-items-center">
                    <img class="img-thumbnail layer-thumbnail" src="../static/logo.png" :alt="idx">
                  </div>
                  <div class="col-8 d-flex align-items-center">
                    <p class="ml-3 mb-0 layer-name" :title="layer.name">
                      {{ layer.name }}
                    </p>
                  </div>
                </div>
                <button @click="changeVisibility(layer)" class="eye-btn btn ml-auto col-2">
                  <i v-if="layer.visible" class="far fa-eye" :class="{ 'text-white': $vuetify.theme.dark }"></i>
                  <i v-else class="far fa-eye-slash" :class="{ 'text-white': $vuetify.theme.dark }"></i>
                </button>
              </div>
            </div>
          </div>
        </v-card>
      </v-tab-item>
      
      <!-- add layers tab -->
      <v-tab-item>
        <v-card color="sidebar" flat>
          <!-- new layer input -->
          <div class="search-bar container py-3">
            <p class="title">Add layer</p>
            <div class="row no-gutters">
              <button @click="addNewLayer" class="btn col-2"><i class="fas fa-plus fa-lg" :class="{ 'text-white': $vuetify.theme.dark }"></i></button>
              <input v-model="newLayerName" @keypress.enter="addNewLayer" type="text" class="searchInput rounded-pill col-10 px-3 bg-white">
            </div>
          </div>
          <!-- new layers -->
          <div class="d-flex justify-content-between align-items-center px-3">
            <p class="title layers-title ">Added Layers</p>
          </div>
          <!-- new layer list -->
          <div class="layer-list container py-3 px-0"  :class="{ 'scroll-sect-dark': $vuetify.theme.dark, 'scroll-sect-light': !$vuetify.theme.dark }">
            <div v-for="(layer, idx) in newLayers" :key="idx">
              <div class="row no-gutters py-3 px-3 rounded" :class="{ 'accent': layer.selected }">
                <div @click="clickLayer(layer)" class="layer-info row no-gutters col-9">
                  <div class="col-4 d-flex justify-content-center align-items-center">
                    <img class="img-thumbnail layer-thumbnail" src="../static/logo.png" :alt="idx">
                  </div>
                  <div class="col-8 d-flex align-items-center">
                    <p class="ml-3 mb-0 layer-name" :title="layer.name">
                      {{ layer.name }}
                    </p>
                  </div>
                </div>
                <div class="d-flex col-3">
                  <button @click="changeVisibility(layer)" class="eye-btn btn ml-auto">
                    <i v-if="layer.visible" class="far fa-eye" :class="{ 'text-white': $vuetify.theme.dark }"></i>
                    <i v-else class="far fa-eye-slash" :class="{ 'text-white': $vuetify.theme.dark }"></i>
                  </button>
                  <button @click="deleteLayer(layer)" class="eye-btn btn ml-auto col-2">
                    <i class="fas fa-times" :class="{ 'text-white': $vuetify.theme.dark }"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
module.exports = {
  name: 'leftPanel',
  props: {
    layers: Object
  },

  data: function () {
    return {
      tab: 0,
      searchKeyword: null,
      clickedLayer: null,
      windowReadyState: false,
      allLayersVisible: true,
      newLayerName: null,
      newLayers: [],
    }
  },

  methods: {
    getSearchResult() {
      if (this.searchKeyword !== null) {
        this.searchKeyword = null
      }
    },
    
    clickLayer(layer) {
      if (this.clickedLayer) {
        this.clickedLayer.selected = !this.clickedLayer.selected
        if (this.clickedLayer === layer) {
          this.clickedLayer = null
          this.$emit('layer-selected', null)
          return false
        }
      }
      this.clickedLayer = layer
      layer.selected = !layer.selected
      if (layer.selected === true) {
        this.$emit('layer-selected', layer)
      } 
    },
    
    clickMain() {
      this.clickedLayer = null
      for (var layer of this.layers) {
        layer.selected = false
      }
      for (var layer of this.newLayers) {
        layer.selected = false
      }
      this.$emit('layer-selected', null)
    },
    
    changeVisibility(layer) {
      layer.visible = !layer.visible
      if (layer.visible) {
        // if (!this.allLayersVisible) {
        //   this.allLayersVisible = !this.allLayersVisible;
        // };
        setFillOpacity( layer.name + ".**", Number(layer.opacity));
        setStrokeOpacity( layer.name + ".**", Number(layer.opacity));
      } else {
        setFillOpacity( layer.name + ".**", 0);
        setStrokeOpacity( layer.name + ".**", 0);
      }
    },
    
    changeAllVisibility() {
      this.allLayersVisible = !this.allLayersVisible
      if (this.allLayersVisible) {
        this.layers.forEach(layer => {
          layer.visible = true
          setFillOpacity( layer.name + ".**", Number(layer.opacity));
          setStrokeOpacity( layer.name + ".**", Number(layer.opacity));
        });
      } else {
        this.layers.forEach(layer => {
          layer.visible = false
          setFillOpacity( layer.name + ".**", 0);
          setStrokeOpacity( layer.name + ".**", 0);
        });
      }
    },
    
    addNewLayer() {
      if (this.newLayerName !== null) {
        this.newLayers.push({
          name: this.newLayerName,
          // inFrame: layer[1],
          // outFrame: layer[2],
          visible: true,
          selected: false,
          opacity: 100,
          xPos: 0,
          yPos: 0,
          scaleWidth: 100,
          scaleHeight: 100,
          rotation: 0,
          color: {
            alpha: Number(),
            hex: String(),
            hexa: String(),
            hsla: {
              h: Number(),
              s: Number(),
              l: Number(),
              a: Number()
            },
            hsva: {
              h: Number(),
              s: Number(),
              v: Number(),
              a: Number()
            },
            hue: Number(),
            rgba: {
              r: Number(),
              g: Number(),
              b: Number(),
              a: Number()
            }
          }
        })
        this.newLayerName = null
      }
    },

    deleteLayer(layerToDelete) {
      for (var i = 0; i < this.newLayers.length; i++) {
        if (this.newLayers[i].name === layerToDelete.name) {
          this.newLayers.splice(i, 1)
          i--
        }
      }
    },
  }
}
</script>

<style scoped>
  .title {
    font-size: 1.5rem;
  }
  
  .eye-btn:focus {
    box-shadow: none;
  }

  .searchInput:focus {
    outline: none;
  }

  .layer-info:hover {
    cursor: pointer;
  }

  .layer-name {
    font-size: 1.2rem;
  }

  .preview-thumbnail {
    width: 8vh;
    height: 8vh;
  }

  .layer-thumbnail {
    width: 60px;
    height: 60px;
  }

  .left-sidebar {
    height: 92vh;
  }

  .preview {
    height: 12vh;
    cursor: pointer;
  }

  .search-bar {
    height: 15vh;
  }

  .layers-title {
    height: 4vh;
    margin-top: 1vh;
    margin-bottom: 1vh;
  }

  .layer-list {
    height: 52vh;
    overflow-y: scroll; 
  }

  .name, .layer-name {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* number of lines to show */
    -webkit-box-orient: vertical;
  }
</style>