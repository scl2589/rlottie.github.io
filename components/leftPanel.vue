<template>
  <div class="bg-sidebar left-sidebar">
    <!-- preview -->
    <div class="preview container py-3 bg-blue d-flex align-items-center" @click="clickMain">
      <div class="row no-gutters">
        <div class="col-3 d-flex justify-content-center align-items-center">
          <img class="img-thumbnail preview-thumbnail" src="" alt="preview">
        </div>
        <div class="col-9 d-flex align-items-center">
          <h5 class="ml-4 name mb-0" id="contentName">FileName</h5>
        </div>
      </div>
    </div>

    <!-- search bar -->
    <div class="search-bar container py-3">
      <p class="title">Search layer</p>
      <div class="row no-gutters">
        <button @click="getSearchResult" class="btn col-2"><i class="text-white fas fa-search fa-lg"></i></button>
        <input v-model="searchKeyword" @keypress.enter="getSearchResult" type="text" class="searchInput rounded-pill col-10 px-3 bg-white">
      </div>
    </div>

    <!-- layer list -->
    <p class="title px-3 layers-title">Layers</p>
    <div class="layer-list container py-3 px-0">
      <div v-for="(layer, idx) in layers" :key="layer.idx">
        <div class="row no-gutters py-3 px-3 rounded" :class="{ 'bg-green': layer.selected }">
          <div @click="clickLayer(layer)" class="layer-info row no-gutters col-10">
            <div class="col-4 d-flex justify-content-center align-items-center">
              <img class="img-thumbnail layer-thumbnail" src="" :alt="layer.idx">
            </div>
            <div class="col-8 d-flex align-items-center">
              <p class="ml-3 mb-0 layer-name" :title="layer.name">
                {{ layer.name }}
              </p>
            </div>
          </div>
          <button @click="changeVisibility(layer)" class="eye-btn btn ml-auto col-2">
            <i v-if="layer.visible" class="text-white far fa-eye"></i>
            <i v-else class="text-white far fa-eye-slash"></i>
          </button>
        </div>
      </div>
    </div>
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
      searchKeyword: null,
      clickedLayer: null,
      windowReadyState: false
    }
  },
  methods: {
    getSearchResult() {
      if (this.searchKeyword !== null) {
        console.log(this.searchKeyword)
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
      this.$emit('layer-selected', null)
    },
    changeVisibility(layer) {
      layer.visible = !layer.visible
      if (layer.visible) {
        setFillOpacity( layer.name + ".**", Number(layer.opacity));
        setStrokeOpacity( layer.name + ".**", Number(layer.opacity));
      } else {
        setFillOpacity( layer.name + ".**", 0);
        setStrokeOpacity( layer.name + ".**", 0);
      }
    }
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
    height: 12vh;
  }

  .layers-title {
    height: 4vh;
    margin-top: 1vh;
    margin-bottom: 1vh;
  }

  .layer-list {
    height: 62vh;
    overflow-y: scroll; 
  }

  .layer-list::-webkit-scrollbar {
    width: 8px; 
    height: 8px;
  }

  .layer-list::-webkit-scrollbar-track {
    background: #1D3557;
    border-radius: 15px;
  }

  .layer-list::-webkit-scrollbar-corner {
    background: #1D3557; 
  }

  .layer-list::-webkit-scrollbar-thumb {
    background: rgba(15, 128, 170);
  }

  .layer-list::-webkit-scrollbar-button {
    background-color: red;
    height: 0;
  }

  .name, .layer-name {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* number of lines to show */
    -webkit-box-orient: vertical;
  }
</style>