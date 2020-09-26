<template>
  <div class="bg-sidebar">
    <!-- preview -->
    <div class="preview container py-3 bg-blue">
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
    <div class="layer-list container py-3 px-0">
      <p class="title px-3">Layers</p>
      <div v-for="layer in layers" :key="layer.name">
        <div class="row no-gutters py-3 px-3 rounded" :class="{ 'bg-green': layer.selected }">
          <div @click="clickLayer(layer)" class="layer-info row no-gutters">
            <img class="img-thumbnail layer-thumbnail" src="" :alt="layer.name">
            <p class="layer-name my-auto ml-4">{{ layer.name }}</p>
          </div>
          <button @click="layer.visible = !layer.visible" class="eye-btn btn ml-auto">
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
  data: function () {
    return {
      'searchKeyword': null,
      'clickedLayer': null,
      // layers: [
      //   {
      //     name: 'layer1',
      //     visible: true,
      //     selected: false
      //   },
      //   {
      //     name: 'layer2',
      //     visible: true,
      //     selected: false
      //   },
      //   {
      //     name: 'layer3',
      //     visible: true,
      //     selected: false
      //   },
      // ],
      layers: [],
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
      this.layers2 = getLayerList() 
      console.log(this.layers2)
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
  created() {
    console.log("leftPanel created")
    setTimeout(() => {
      this.layers = getLayerList();
      for(let i=0;i<this.layers.length;i++) {
        console.log(this.layers[i].name+ " " + this.layers[i].inFrame + " " + this.layers[i].outFrame);
      }
      // [0, 1] <- [0, 255]
      setFillColor("el.**", (123/255), 0, 0);
      setStrokeColor("el.**", (123/255), 0, 0);
      setFillOpacity("b1.**", 50);
      // setStrokeOpacity
      setStrokeWidth("b.**", 35);
      setPosition("el.**", 20, -30);
      setScale("el.**", 100, 100);
      setRotation("el.**", 360);
    }, 500);
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
    width: 70px;
    height: 70px;
  }

  .layer-thumbnail {
    width: 60px;
    height: 60px;
  }
</style>