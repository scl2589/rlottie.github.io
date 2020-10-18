class LayerNode {
  constructor(keypath, name, type, id, commonId) {
    this.id = id;
    this.commonId = commonId;
    this.keypath = keypath;
    this.name = name;
    this.type = type;
    this.visible = true;
    this.selected = false;
    this.opacity = 100;
    this.beforeOpacity = 100;
    this.strokeWidth = Number();
    this.color = {
      alpha: Number(),
      hex: String(),
      hexa: String(),
      hsla: {
        h: Number(),
        s: Number(),
        l: Number(),
        a: Number(),
      },
      hsva: {
        h: Number(),
        s: Number(),
        v: Number(),
        a: Number(),
      },
      hue: Number(),
      rgba: {
        r: Number(),
        g: Number(),
        b: Number(),
        a: Number()
      }
    }
    this.child = []
  }
}