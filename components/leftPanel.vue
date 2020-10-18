<template>
  <div class="sidebar left-sidebar">
    <!-- preview -->
    <div 
      class="preview container py-3 d-flex align-items-center" 
      @click="clickMain"
    >
      <h5 
        class="ml-2 name mb-0 text-white" 
        id="contentName" 
        title="FileName"
      >
        Anubis.json
      </h5>
    </div>

    <!-- tabs -->
    <v-tabs
      fixed-tabs
      v-model="tab"
      background-color="sidebar"
      color="text"
    >
      <v-tabs-slider color="preview"></v-tabs-slider>
      <v-tab @click="changeTab">
        Layers
      </v-tab>
      <v-tab @click="changeTab">
        Search
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <!-- layers tab -->
      <v-tab-item>
        <v-card 
          flat
          color="sidebar" 
        >
          <div class="d-flex justify-content-between align-items-center container pb-2">
            <!-- reset button -->
            <v-dialog
              v-model="resetDialog"
              max-width="400"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="btn" 
                  depressed 
                  rounded 
                  color="preview" 
                  v-bind="attrs"
                  v-on="on"
                >
                Reset
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="headline">
                  Reset changes?
                </v-card-title>
                <v-card-text>This will reset all the changes that you made to this file.</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="text"
                    text
                    @click="resetDialog = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    color="preview"
                    text
                    @click="clickReset(canvasid)"
                  >
                    Reset
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <!-- change visibility for all layers -->
            <div class="d-none sidebar--text">
              {{ allLayersVisible }}
            </div>
            <div 
              class="d-flex justify-content-start align-items-center"
              v-if="layers" 
            >
              <v-tooltip 
                bottom 
                nudge-top="10"
              >
                <template v-slot:activator="{ on, attrs }">
                  <button 
                    class="eye-btn btn" 
                    v-bind="attrs" 
                    v-on="on"
                    @click="changeAllVisibility" 
                  >
                    <em 
                      class="far fa-eye" 
                      :class="{ 'text-white': $vuetify.theme.dark }"
                      v-if="layers.allVisibility" 
                    ></em>
                    <em 
                      class="far fa-eye-slash" 
                      :class="{ 'text-white': $vuetify.theme.dark }"
                      v-else 
                    ></em>
                  </button>
                </template>
                <span v-if="layers.allVisibility">Make all layers invisible</span>
                <span v-else>Make all layers visible</span>
              </v-tooltip>
            </div>
          </div>
          <!-- layer list -->
          <div 
            class="layer-list container py-3 px-0" 
            :class="{ 'scroll-sect-dark': $vuetify.theme.dark, 'scroll-sect-light': !$vuetify.theme.dark }"
          >
            <v-treeview 
              hoverable
              activatable
              return-object
              transition
              :items="layers"
              :active.sync="selectedLayer"
              :active-class="$vuetify.theme.dark ? 'selected-layer-dark' : 'selected-layer-light'"
              color="text"
              expand-icon="mdi-chevron-down"
              item-children="child"
              item-key="id"
              @update:active="clickLayer(selectedLayer)"
            >
              <template v-slot:prepend="{ item }">
                <div 
                  class="d-flex justify-content-center align-items-center my-3 ml-3"
                  v-if="topNodes.includes(item.keypath)" 
                >
                  <div class="thumbnailbox">
                    <canvas 
                      :id="item.id" 
                      width="60" 
                      height="60"
                    ></canvas>
                  </div>
                </div>
              </template>
              <template v-slot:label="{ item }">
                <div class="d-flex align-items-center">
                    <p 
                      class="ml-3 mb-0 layer-name" 
                      v-if="topNodes.includes(item.keypath)" 
                      :title="item.keypath"
                    >
                      {{ item.name }}
                    </p>
                    <p 
                      class="mb-0 layer-name child-layer-name" 
                      v-else 
                      :title="item.keypath">
                      {{ item.name }}
                    </p>
                </div>
              </template>
              <template v-slot:append="{ item }">
                <div 
                  class="d-flex align-items-center"
                  v-if="topNodes.includes(item.keypath)" 
                >
                  <button 
                    class="eye-btn btn"
                    @click.stop="changeVisibility(item)" 
                  >
                    <em 
                      class="far fa-eye" 
                      :class="{ 'text-white': $vuetify.theme.dark }"
                      v-if="item.visible" 
                    ></em>
                    <em 
                      class="far fa-eye-slash" 
                      :class="{ 'text-white': $vuetify.theme.dark }"
                      v-else 
                    ></em>
                  </button>
                </div>
              </template>
            </v-treeview>
          </div>
        </v-card>
      </v-tab-item>
      
      <!-- search tab -->
      <v-tab-item>
        <v-card 
          flat
          color="sidebar" 
        >
          <div class="search-bar container">
            <div class="d-flex align-items-center mb-3">
              <p class="title m-0">Search layer</p>
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <em
                    class="far fa-question-circle fa-sm ml-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                  </em>
                </template>
                <span>Keypath should be linked with periods</span>
              </v-tooltip>
            </div>
            <div class="row no-gutters">
              <!-- search bar -->
              <v-text-field
                solo
                rounded
                hide-details
                clearable
                v-model="searchKeyword"
                placeholder="ex) parentLayer.childLayer"
                prepend-icon="mdi-magnify"
                color="text"
                clear-icon="mdi-close-circle-outline"
              ></v-text-field>
            </div>
          </div>
          <!-- search result -->
          <div 
            class="search-layer-list container mt-4 px-0" 
            :class="{ 'scroll-sect-dark': $vuetify.theme.dark, 'scroll-sect-light': !$vuetify.theme.dark }"
          >
            <v-treeview 
              activatable
              hoverable
              return-object
              transition
              open-all
              v-show="searchKeyword"
              :items="layers"
              :active.sync="selectedLayer"
              :active-class="$vuetify.theme.dark ? 'selected-layer-dark' : 'selected-layer-light'"
              :search="searchKeyword"
              color="text"
              expand-icon="mdi-chevron-down"
              item-children="child"
              item-key="id"
              item-text="keypath"
              @update:active="clickLayer(selectedLayer)"
            >
              <template v-slot:label="{ item }">
                <div class="d-flex align-items-center ml-3">
                    <p 
                      class="mb-0 layer-name" 
                      :title="item.keypath"
                    >
                      {{ item.name }}
                    </p>
                </div>
              </template>
              <template v-slot:append="{ item }">
                <div 
                  class="d-flex align-items-center"
                  v-if="topNodes.includes(item.keypath)" 
                >
                  <button 
                    class="eye-btn btn"
                    @click="changeVisibility(item)" 
                  >
                    <em 
                      class="far fa-eye" 
                      :class="{ 'text-white': $vuetify.theme.dark }"
                      v-if="item.visible" 
                    ></em>
                    <em 
                      class="far fa-eye-slash" 
                      :class="{ 'text-white': $vuetify.theme.dark }"
                      v-else 
                    ></em>
                  </button>
                </div>
              </template>
            </v-treeview>
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
    canvasid: Number,
    trigger: Boolean
  },

  data() {
    return {
      tab: 0,
      allLayersVisible: true,
      selectedLayer: [],
      searchKeyword: null,
      resetDialog: false,
    }
  },

  computed: {
    topNodes() {
      var nodes = []
      for (let node of this.layers) {
        nodes.push(node.keypath)
      }
      return nodes
    },
  },

  watch: {
    trigger() {
      this.selectedLayer = []
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
      this.selectedLayer = []
      this.$emit('layer-selected', null)
    },  

    changeVisibility(layer) {
      layer.visible = !layer.visible
      if (layer.visible) {
        setLayerOpacity(layer, Number(layer.beforeOpacity), this.canvasid)
      } else {
        setLayerOpacity(layer, 0, this.canvasid)
      }
    },

    changeAllVisibility() {
      this.layers.allVisibility = !this.layers.allVisibility
      this.allLayersVisible = this.layers.allVisibility
      if (this.layers.allVisibility) {
        this.layers.forEach(layer => {
          layer.visible = true
          setLayerOpacity(layer, Number(layer.beforeOpacity), this.canvasid)
        });
      } else {
        this.layers.forEach(layer => {
          if (!layer.visible) layer.opacity = layer.beforeOpacity;
          layer.visible = false;
          setLayerOpacity(layer, 0, this.canvasid)
        });
      }
    },

    clickReset(index) {
      rlottieHandler.reset(index)
      this.resetDialog = false
    },

    changeTab() {
      this.selectedLayer = []
    },
  },

  mounted() {
    this.allLayersVisible = this.layers.allVisibility
  },
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

  .selected-layer-light {
    background-color: rgba(168, 218, 220, 0.9);
  }

  .selected-layer-dark {
    background-color: rgba(9, 142, 143, 0.7);
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

  .name, .layer-name {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .thumbnailbox {
    width: 60px;
    height: 60px;
    background-color: white;
    border-radius: 10px;
  }
  
  .layer-list {
    height: 64vh;
    overflow-y: scroll; 
  }

  .search-layer-list {
    height: 56vh;
    overflow-y: scroll; 
  }

  .v-treeview-node__content {
    margin: 0;
  }

</style>