<template>
  <div class="bg-sidebar left-sidebar">
    <!-- preview -->
    <div class="preview container py-3 bg-blue d-flex align-items-center">
      <div class="row no-gutters">
        <img class="img-thumbnail preview-thumbnail" src="" alt="preview">
        <h5 class="my-auto ml-4" id="contentName">FileName</h5>
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
            <img class="img-thumbnail layer-thumbnail col-4" src="" :alt="layer.idx">
            <div class="col-8 d-flex align-items-center">
              <p class="ml-3 mb-0 layer-name">
                {{ layer.name }}
              </p>
            </div>
          </div>
          <button @click="layer.visible = !layer.visible" class="eye-btn btn ml-auto col-2">
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
      'searchKeyword': null,
      'clickedLayer': null,
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
  width: 8px; height: 8px; border: 3px solid white;
  /* border-radius: 15px; */
  }

  /* .layer-list::-webkit-scrollbar-button,.layer-list::-webkit-scrollbar-button:END {
    background-color: white;
  } */

  /* .layer-list::-webkit-scrollbar-button:start:decrement{
    background-color: red;
  } */

  .layer-list::-webkit-scrollbar-track {
    background: white;
    border-radius: 15px;
    /* -webkit-border-radius: 20px white;  */
    /* border-radius:20px white; */
    /* -webkit-border-radius: 15px; border-radius: 15px;  */
  }

  .layer-list::-webkit-scrollbar-corner {
    background: #1D3557; 
    /* -webkit-border-radius: 20px white; 
    border-radius:20px white; */
    /* -webkit-border-radius: 15px; border-radius: 15px;  */
  }

  .layer-list::-webkit-scrollbar-thumb {
    /* background: #0075ff; */
    background: rgba(15, 128, 170);
    /* border: 1px solid rgba(15, 128, 170, 0.77); */
    /* -webkit-border-radius: 15px; border-radius: 15px;  */
  }

  .layer-list::-webkit-scrollbar-button {
    background-color: red;
    height: 0;
  }
</style>