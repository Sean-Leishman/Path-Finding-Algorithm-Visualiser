class KrusSet {
  constructor() {
    this.parent = null;
  }

  get root() {
    return this.parent != null ? this.parent.root : this;
  }

  is_connected(tree) {
    return this.root === tree.root;
  }

  connect(tree) {
    tree.root.parent = this;
  }
}

export default KrusSet;
