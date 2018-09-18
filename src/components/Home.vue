<template>
  <div id="app">
    <!-- header -->
    <div>
      <el-header style="background-color: #16181d;">
        <!-- <div style="float: left;height: 60px;">
          <img src="../assets/logo.png" style="height:50px;width:50px;margin:5px 10px;" alt="">
        </div> -->
        <div v-if="welcome" style="float: left;height: 60px;color:#909399">欢迎来到装师通后台管理系统</div>
        <div style="float: right;color:#fff; font-size: 12px;margin-right:50px;">
          <i class="el-icon-star-on" style="color:#fff;" @click="editseq()" v-if="!Warning"></i>
          <i class="el-icon-warning" style="color:red;" @click="editseq()" v-if="Warning"></i>
          <span style="margin-right: 30px" @click="editseq()">匹配次数</span>
          <el-dropdown>
            <i class="el-icon-setting" style="margin-right: 15px;color:#fff;"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div @click="jumpTo('/manage')">
                  <span style="color: #555;font-size: 14px;">个人信息</span>
                </div>
              </el-dropdown-item>
              <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span @click="aaa()">{{userName}}</span>
        </div>
        <div class="clear"></div>
      </el-header>
    </div>
    <!-- body -->
    <el-container>
      <aside style="background-color: #16181D;">
        <div style="text-align:center">
          <img v-if="!iscloseNav" src="../../static/images/open_nav.png" style="width:30px;height:30px;margin:5px 10px;" alt="" @click="closeNav()">
          <img v-else src="../../static/images/close_nav.png" style="width:30px;height:30px;margin:5px 10px;" alt="" @click="closeNav()">
        </div>
        <el-menu style="background-color: #16181D;" class="el-menu-vertical-demo" :default-active="$route.path" router :unique-opened='true'
          @select="handleSelect" :collapse='iscloseNav'>
          <template v-for="(item,index) in menuList">
            <el-submenu :index="index+''" :key="index">
              <template slot="title">
                <img src="../../static/images/menu_list.png" v-if="!iscloseNav" alt="">
                <i v-else class="el-icon-menu"></i>
                <span slot="title" style="color:#b3c0d1">{{item.name}}</span>
              </template>
              <el-menu-item v-for="(ll,ii) in item.snippet" :key="ii" :index="'/'+ll.urlf.split('.')[0]">{{ll.title}}</el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </aside>
      <!-- 右侧路由信息 -->
      <el-container>
        <el-main v-if="collapsed">
          <router-view></router-view>
        </el-main>
        <el-main v-else>
          <h2>装师通后台管理</h2>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
      <el-input v-model="value"></el-input>
      已匹配/匹配上限：{{Val}}
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="match()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        centerDialogVisible: false,
        value: '',
        Val: '',
        defaultActiveIndex: ["0"],
        menuList: [],
        userName: "",
        collapsed: false,
        iscloseNav: false,
        welcome: true,
        Warning:false
      };
    },
    mounted() {
      var w = window.innerWidth;
      if (w < 500) {
        this.welcome = false;
      }
      this.userName = getCookie("username");
      var url = window.location.href;
      if (url.split("#")[1] == "/") {} else {
        this.collapsed = true;
      }
      var tt = this;
      if (getCookie("token")) {
        this.$http
          .get("api/Menu/GetMenus", {
            params: {
              Token: getCookie("token")
            }
          })
          .then(
            function (response) {
              var status = response.data.Status;
              if (status === 1) {
                this.menuList = response.data.Result;
                // localStorage.setItem(
                //   "menulist",
                //   JSON.stringify(response.data.Result)
                // );
              } else if (status === 40001) {
                this.$message({
                  showClose: true,
                  type: "warning",
                  message: response.data.Result
                });
                setTimeout(() => {
                  this.$router.push({
                    path: "/login"
                  });
                }, 1500);
              } else {
                this.$message({
                  showClose: true,
                  type: "warning",
                  message: response.data.Result
                });
              }
            }.bind(this)
          )
          .catch(
            function (error) {
              this.$notify.error({
                title: "错误",
                message: "错误：请检查网络"
              });
              setTimeout(() => {
                this.$router.push({
                  path: "/error"
                });
              }, 1500);
            }.bind(this)
          );
          this.first()
      } else {
        this.$message({
          showClose: true,
          type: "warning",
          message: "请先登陆"
        });
        setTimeout(() => {
          this.$router.push({
            path: "/login"
          });
        }, 1500);
      }
    },
    methods: {
      first() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_BasicMessage/GetMatchTimes", {
            params: {
              Token: getCookie("token"),
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.Val = response.data.Result.Val;
                if(response.data.Result.Warning){
                  this.Warning = true;
                }else{
                  this.Warning = false;
                }
              } else if (status === 40001) {
                this.$message({
                  showClose: true,
                  type: "warning",
                  message: response.data.Result
                });
                setTimeout(() => {
                  this.$router.push({
                    path: "/login"
                  });
                }, 1500);
              } else if (status === -1) {
                this.Val = response.data.Result.Val;
                if(response.data.Result.Warning){
                  this.Warning = true;
                }else{
                  this.Warning = false;
                }
              } else {
                loading.close();
                this.$message({
                  showClose: true,
                  type: "warning",
                  message: response.data.Result
                });
              }
            }.bind(this)
          )
          // 请求error
          .catch(
            function (error) {
              loading.close();
              this.$notify.error({
                title: "错误",
                message: "错误：请检查网络"
              });
            }.bind(this)
          );
      },
      // 	index: 选中菜单项的 index, indexPath: 选中菜单项的 index path
      handleSelect(index) {
        this.collapsed = true;
        // this.defaultActiveIndex = [index];
        // console.log(this.$route.path);
      },
      // 个人中心  修改密码
      jumpTo(url) {
        // this.defaultActiveIndex = url;
        console.log(url);
        this.collapsed = true;
        this.$router.push(url);
      },
      // 退出
      logout() {
        let that = this;
        this.$confirm("确认退出吗?", "提示", {
            confirmButtonClass: "el-button--warning"
          })
          .then(() => {
            //确认
            that.loading = true;
            delCookie("token");
            this.$router.push("/login");
          })
          .catch(() => {});
      },
      closeNav() {
        this.iscloseNav = !this.iscloseNav;
        if (this.iscloseNav) {
          $(".el-aside").css({
            width: "60px"
          });
        }
      },
      editseq(seq, id) {
        this.centerDialogVisible = true;
        this.value = '';
      },
      match() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_BasicMessage/GetMatchTimes", {
            params: {
              Token: getCookie("token"),
              valve: this.value,
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: response.data.Result.Msg
                });
                if(response.data.Result.Warning){
                  this.Warning = true;
                }else{
                  this.Warning = false;
                }
                this.centerDialogVisible = false
              } else if (status === 40001) {
                this.$message({
                  showClose: true,
                  type: "warning",
                  message: response.data.Result
                });
                setTimeout(() => {
                  this.$router.push({
                    path: "/login"
                  });
                }, 1500);
              } else if (status === -1) {
                this.$message({
                  showClose: true,
                  type: "warning",
                  message: response.data.Result.Msg
                });
                this.Val = response.data.Result.Val
                if(response.data.Result.Warning){
                  this.Warning = true;
                }else{
                  this.Warning = false;
                }
              } else {
                loading.close();
                this.$message({
                  showClose: true,
                  type: "warning",
                  message: response.data.Result
                });
              }
            }.bind(this)
          )
          // 请求error
          .catch(
            function (error) {
              loading.close();
              this.$notify.error({
                title: "错误",
                message: "错误：请检查网络"
              });
            }.bind(this)
          );
      }
    }
  };

</script>

<style scoped>
  /* @import "../../static/css/index.css"; */

  .el-header {
    color: #333;
    line-height: 60px;
  }

</style>
