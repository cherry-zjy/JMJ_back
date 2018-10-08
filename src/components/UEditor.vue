<template>
  <div>
    <script id='editor' type="text/plain"></script>
  </div>
</template>
<script>
  export default {
    name: "UE",
    data() {
      return {
        editor: null
      };
    },
    props: {
      defaultMsg: {
        type: String
      },
      id: {
        type: String
      },
      config: {
        type: Object
      }
    },
    mounted() {
      //初始化UE
      const _this = this;
      this.editor = UE.getEditor("editor", this.config);
      // console.log(_this.showok)
      // if (_this.showok) {
        // console.log(_this.showok)
        this.editor.addListener("ready", function () {
          console.log('加载完毕' + _this.defaultMsg)
          _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
        });
      // }

    },
    destroyed(){
      this.editor.destroy()
    },
    watch: {
      defaultMsg: function (n,o) {
        // this.$emit('defaultMsg',n)
        this.editor.setContent(n)
        // console.log('参数更改' + n)
      },
    },
    methods: {
      getUEContent() {
        // 获取内容方法
        return this.editor.getContent();
      },
      getUEContentTxt() {
        // 获取纯文本内容方法
        return this.editor.getContentTxt();
      }
    },
  };

</script>
