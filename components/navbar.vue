<template>
  <div class="navbar d-flex justify-content-between">
    <!-- logo -->
    <div class="d-flex align-items-center">
      <img class="logo" src="https://user-images.githubusercontent.com/25967949/94992643-7173a580-05c6-11eb-8514-322f459a88d8.png" alt="logo">
    </div>

    <!-- button group -->
    <div class="d-flex">
      <div class="d-none d-sm-block">

        <!-- single/multi view -->
        <button class="multiview-btn btn mx-2 view-count preview text-white" @click="changeViewCount">{{ viewCount }}</button>
        <!-- light/dark mode -->
        <button v-if="$vuetify.theme.dark" class="btn mx-2 mode" @click="changeMode"><v-icon class="text-dark">mdi-white-balance-sunny</v-icon></button>
        <button v-else class="btn mx-2 mode" @click="changeMode"><em class="fas fa-moon text-white"></em></button>
      </div>

      <!-- import dialog -->
      <v-dialog
        v-model="importDialog"
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
            Import
            <em class="fas fa-file-import ml-2"></em>
          </button>
        </template>
        <v-card>
          <v-card-title class="headline mb-4">
            Import New Lottie File
          </v-card-title>
          <v-card-text class="pt-3">
            <div class="filebox d-flex justify-center">
              <input class="upload-hidden" type="file" id="fileSelector" accept=".json" placeholder="New Lottie" @click="clickFileUpload" @change="clickImportDialogClose" hidden>
              <v-btn outlined color="upload" width="100%" class="py-7" @click="clickNewLottie">
                <v-icon class="mr-2">mdi-paperclip</v-icon>
                Upload Lottie File
              </v-btn>
            </div>
            <h5 class="my-3 text-center">or</h5>
            <div class="d-flex align-items-center">
              <v-text-field
                outlined
                placeholder="Lottie File URL"
                v-model="lottieURL"
                hide-details
                color="icon"
              ></v-text-field>
              <v-btn large class="ml-4" color="accent" @click="enterLottieURL">Import</v-btn>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text
              @click="clickImportDialogClose"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- export to gif -->
      <v-dialog
        v-model="exportdialog"
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
            Export
            <em class="fas fa-file-export ml-2"></em>
          </button>
        </template>
        <v-card>
          <v-card-title class="headline mb-2">
            Export file to GIF
          </v-card-title>
          <v-card-subtitle>
            Size: {{canvasWidth}}px x {{canvasHeight}}px
          </v-card-subtitle>
          <v-card-text>
            <div class="d-flex align-items-center">
              <v-text-field
                solo-reverse
                color="text"
                placeholder="File name"
                v-model="gifname"
              ></v-text-field>
              <v-btn class="ml-4" color="accent" @click="downloadGIF" :disabled="downloadDisabled">Download</v-btn>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="text"
              text
              @click="clickExportDialogClose"
              :disabled="closeDisabled"
            >
              Close
            </v-btn>
          </v-card-actions>
          <v-overlay :value="exportOverlay" opacity="0.6">
            <div class="d-flex flex-column justify-content-center align-items-center">
              <h4 class="mb-5">Creating GIF file...</h4>
              <v-progress-circular
                indeterminate
                size="50"
              ></v-progress-circular>
            </div>
          </v-overlay>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: 'navbar',
  props: {
    exportdialog: Boolean,
  },
  data: function () {
    return {
      viewCount: 'Multi View',
      gifname: "",
      canvasWidth: 0,
      canvasHeight: 0,
      exportOverlay: false,
      downloadDisabled: false,
      closeDisabled: false,
      importDialog: false,
      lottieURL: "",
    }
  },
  watch: {
    exportdialog(val) {
      if(val) {
        this.canvasWidth = getRModule(rlottieHandler.mainCanvasId).canvas.width;
        this.canvasHeight = getRModule(rlottieHandler.mainCanvasId).canvas.height;
        pause();
      } else {
        document.getElementById("playButton").innerHTML = "<i class='fas fa-pause'></i>";
        rlottieHandler.play();
      }
    }
  },
  methods: {
    changeMode() {
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    },
    changeViewCount() {
      if (this.viewCount === 'Multi View') {
        this.viewCount = 'Single View'
        this.$emit('viewcount-changed', true)
      } else {
        this.viewCount = 'Multi View'
        this.$emit('viewcount-changed', false);
      }
      windowResize();
    },
    clickImportDialogClose() {
      this.importDialog = false
    },
    clickFileUpload() {
      addImportListener()
    },
    clickNewLottie() {
      var fileInput = document.getElementById('fileSelector')
      fileInput.click()
    },
    enterLottieURL() {
      getLottieFromUrl(this.lottieURL)
      this.clickImportDialogClose()
    },
    clickExportDialogClose() {
      this.exportdialog = false
      this.$emit('exportdialog-changed')
    },
    downloadGIF() {
      this.closeDisabled = true
      this.downloadDisabled = true
      this.exportOverlay = true
      if (this.gifname == "") this.gifname = "download";
      rlottieHandler.rlotties[rlottieHandler.mainCanvasId].makeGifFile(this.gifname, _ => {
        this.gifname = "";
        this.closeDisabled = false
        this.downloadDisabled = false
        this.exportOverlay = false;
        this.clickExportDialogClose();
      });
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