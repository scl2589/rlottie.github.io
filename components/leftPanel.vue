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
        Search
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <!-- layers tab -->
      <v-tab-item>
        <v-card color="sidebar" flat>
          <!-- layers -->
          <div class="d-flex justify-content-between align-items-center container">
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
            <v-treeview 
              :items="layers"
              activatable
              color="accent"
              hoverable
              return-object
              expand-icon="mdi-chevron-down"
              :active.sync="selectedLayer"
              @update:active="clickLayer(selectedLayer)"
              item-children="child"
              item-key="keypath"
              item-text="keypath"
            >
              <template v-slot:prepend="{ item }" >
                <div v-if="topNodes.includes(item.keypath)" class="d-flex justify-content-center align-items-center my-3">
                  <img class="img-thumbnail layer-thumbnail ml-1" src="../static/logo.png" :alt="item.keypath">
                </div>
              </template>
              <template v-slot:label="{ item }">
                <div class="d-flex align-items-center">
                    <p class="ml-3 mb-0 layer-name">
                      {{ item.keypath }}
                    </p>
                </div>
              </template>
              <template v-slot:append="{ item }">
                <div v-if="topNodes.includes(item.keypath)" class="d-flex align-items-center">
                  <button @click="changeVisibility(item)" class="eye-btn btn">
                    <i v-if="item.visible" class="far fa-eye" :class="{ 'text-white': $vuetify.theme.dark }"></i>
                    <i v-else class="far fa-eye-slash" :class="{ 'text-white': $vuetify.theme.dark }"></i>
                  </button>
                </div>
              </template>
            </v-treeview>


          </div>


        </v-card>
      </v-tab-item>
      
      <!-- search tab -->
      <v-tab-item>
        <v-card color="sidebar" flat>
          <!-- search bar -->
          <div class="search-bar container">
            <p class="title">Search layer</p>
            <div class="row no-gutters">
              <button @click="getSearchResult" class="btn col-2"><i class="fas fa-search fa-lg" :class="{ 'text-white': $vuetify.theme.dark }"></i></button>
              <input v-model="searchKeyword" @keypress.enter="getSearchResult" type="text" class="searchInput rounded-pill col-10 px-3 bg-white">
            </div>
          </div>
          <div>
            

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
    layers: Object,
    canvasid: Number
  },

  data: function () {
    return {
      tab: 0,
      searchKeyword: null,
      clickedLayer: null,
      windowReadyState: false,
      allLayersVisible: true,
      selectedLayer: [],

    }
  },

  computed: {

    topNodes() {
      var nodes = []
      for (node of this.layers) {
        nodes.push(node.keypath)
      }
      return nodes
    },
  },

  methods: {

    getSearchResult() {
      if (this.searchKeyword !== null) {
        this.searchKeyword = null
      }
    },
    
    clickLayer(layer) {
      this.$emit('layer-selected', layer[0])
    },
    
    clickMain() {
      this.clickedLayer = null
      for (var layer of this.layers) {
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
        setLayerOpacity( layer.name + ".**", Number(layer.opacity), this.canvasid, "Fill")
        setLayerOpacity( layer.name + ".**", Number(layer.opacity), this.canvasid, "Stroke")
        // setFillOpacity( layer.name + ".**", Number(layer.opacity), this.canvasid);
        // setStrokeOpacity( layer.name + ".**", Number(layer.opacity), this.canvasid);
      } else {
        setLayerOpacity( layer.name + ".**", 0, this.canvasid, "Fill")
        setLayerOpacity( layer.name + ".**", 0, this.canvasid, "Stroke")
        // setFillOpacity( layer.name + ".**", 0, this.canvasid);
        // setStrokeOpacity( layer.name + ".**", 0, this.canvasid);
      }
    },
    
    changeAllVisibility() {
      this.allLayersVisible = !this.allLayersVisible
      if (this.allLayersVisible) {
        this.layers.forEach(layer => {
          layer.visible = true
          setLayerOpacity( layer.name + ".**", Number(layer.opacity), this.canvasid, "Fill")
          setLayerOpacity( layer.name + ".**", Number(layer.opacity), this.canvasid, "Stroke")
          // setFillOpacity( layer.name + ".**", Number(layer.opacity), this.canvasid);
          // setStrokeOpacity( layer.name + ".**", Number(layer.opacity), this.canvasid);
        });
      } else {
        this.layers.forEach(layer => {
          layer.visible = false
          setLayerOpacity( layer.name + ".**", 0, this.canvasid, "Fill")
          setLayerOpacity( layer.name + ".**", 0, this.canvasid, "Stroke")
          // setFillOpacity( layer.name + ".**", 0, this.canvasid);
          // setStrokeOpacity( layer.name + ".**", 0, this.canvasid);
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
    clickReset(index) {
      rlottieHandler.reset(index)
    }
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

  /* .selected-layer {
    color: white;
    background-color: #A8DADC;
  } */

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
    height: 63vh;
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