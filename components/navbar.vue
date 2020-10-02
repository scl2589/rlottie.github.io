<template>
  <div class="navbar d-flex justify-content-between">
    <!-- logo -->
    <div class="d-flex align-items-center">
        <img class="logo" src="../static/logo.png" alt="logo">
        <h2 class="ml-3">PrettyView</h2>
    </div>

    <!-- button group -->
    <div class="d-flex">

      <div class="d-none d-sm-block">
        <!-- Shortcut -->
        <v-dialog
          v-model="exportDialog2"
          max-width="500"
        >
          <template v-slot:activator="{ on, attrs }">
            <button
              class="btn accent mx-2" 
              :class="{ 'text-white': $vuetify.theme.dark }" 
              depressed 
              v-bind="attrs"
              v-on="on"
            >
              Shortcut
            </button>
          </template>
          <v-card>
            <v-card-title class="headline">
              Shortcut
            </v-card-title>
            <v-card-text>
              <div class="d-flex align-items-center">
                <ul>
                  <li>shift + space : play/pause</li>
                  <li>shift + m : dark mode/light mode</li>
                  <li>shift + v : multiview/singleview</li>
                  <li>shift + 1/2/3/4: select canvas</li>
                  <li>shift + p : snapshot</li>
                </ul>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="text"
                text
                @click="exportDialog2 = false"
              >
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        

        <!-- single/multi view -->
        <button class="multiview-btn btn mx-2 view-count preview text-white"  @click="changeViewCount">{{ viewCount }}</button>

        <!-- light/dark mode -->
        <button v-if="$vuetify.theme.dark" class="btn mx-2 mode" @click="changeMode"><v-icon class="text-dark">mdi-white-balance-sunny</v-icon></button>
        <button v-else class="btn mx-2 mode" @click="changeMode"><i class="fas fa-moon text-white"></i></button>
      </div>

      <!-- import/export -->
      <div class="filebox mx-2">
        <label for="fileSelector"><span class="d-inline-block pt-1">New Lottie</span></label>
        <input class="upload-hidden" type="file" id="fileSelector" accept=".json" placeholder="New Lottie">
      </div>

      <v-dialog
        v-model="exportDialog"
        max-width="500"
      >
        <template v-slot:activator="{ on, attrs }">
          <button
            class="btn accent mx-2" 
            :class="{ 'text-white': $vuetify.theme.dark }" 
            depressed 
            v-bind="attrs"
            v-on="on"
          >
            Export <i class="fas fa-download ml-2"></i>
          </button>
        </template>
        <v-card>
          <v-card-title class="headline">
            Export file to GIF
          </v-card-title>
          <v-card-text>
            <div class="d-flex align-items-center">
              <v-text-field
                solo-reverse
                color="text"
                placeholder="File name"
                v-model="gifname"
              ></v-text-field>
              <v-btn class="ml-4" color="accent" @click="downloadGIF">Download</v-btn>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="text"
              text
              @click="exportDialog = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      
    </div>
  </div>
</template>

<script>
module.exports = {
  name: 'navbar',
  data: function () {
    return {
      viewCount: 'Multi View',
      exportDialog: false,
      exportDialog2: false,
      gifname: ""
    }
  },
  methods: {
    changeMode() {
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    },
    changeViewCount() {
      console.log(1)
      if (this.viewCount === 'Multi View') {
        this.viewCount = 'Single View'
        this.$emit('viewcount-changed', true)
      } else {
        this.viewCount = 'Multi View'
        this.$emit('viewcount-changed', false)
      }
      windowResize();
    },
    downloadGIF() {
      if(this.gifname == "") return;
      else rlottieHandler.rlotties[rlottieHandler.mainCanvasId].makeGifFile(this.gifname);
      // 끝나고 close, this.gifname = "" 하기
    }
  }
}
</script>

<style scoped>
  .navbar {
    height: 8vh;
    padding-left: 1vw;
    padding-right: 1vw;
  }

  .logo {
    height: 5vh; 
  }

  .lottie-input {
    background-color: #fdfdfd;
    color: #1D3557;
  }

  .filebox input[type="file"] {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip:rect(0,0,0,0);
    border: 0;
  }

  .filebox label {
    display: inline-block;
    padding: .5em .75em;
    color: #1D3557;
    font-size: inherit;
    line-height: normal;
    vertical-align: middle;
    background-color: #ECEFF1;
    cursor: pointer;
    border: 1px solid #ECEFF1;
    border-bottom-color: #ECEFF1;
    border-radius: .25em;
    margin-bottom: 0;
    height: 48px;
  }

  .mode {
    width: 50px;
    height: 48px;
  }

  .multiview-btn {
    height: 48px;
  }

  .view-count {
    background-color: #fdfdfd;
    color: #1D3557
  }
</style>