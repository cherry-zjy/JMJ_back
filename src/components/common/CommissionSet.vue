<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>佣金设置</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row>
      <p class="title">佣金设置</p>
      <el-form label-width="150px" class="demo-editForm" v-for="(item,index) in list" :key="index">
        <el-col :span="12" v-if="item.Name !== '一口价多少件' &&item.Name !== '一口价多少元'&&item.Name !== '通过该链接购买'&&item.Name !== '点击评论链接'&&item.Name !== '发布评论'">
          <el-form-item :label="item.Name" v-if="index%2==0" :id="item.ID">
            <el-input v-model="item.Content" type="number"></el-input>&nbsp;%
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="item.Name !== '一口价多少件' &&item.Name !== '一口价多少元'&&item.Name !== '通过该链接购买'&&item.Name !== '点击评论链接'&&item.Name !== '发布评论'">
          <el-form-item :label="item.Name" v-if="index%2!==0" :id="item.ID">
            <el-input v-model="item.Content" type="number"></el-input>&nbsp;%
          </el-form-item>
        </el-col>
        <div>
        <el-col :span="12" v-if="item.Name == '一口价多少件'">
          <el-form-item :label="item.Name" :id="item.ID">
            <el-input v-model="item.Content" type="number"></el-input>&nbsp;件
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="item.Name == '一口价多少元'">
          <el-form-item :label="item.Name" :id="item.ID">
            <el-input v-model="item.Content" type="number"></el-input>&nbsp;元
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="item.Name == '发布评论'">
          <el-form-item :label="item.Name" :id="item.ID">
            <el-input v-model="item.Content" type="number"></el-input>&nbsp;
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="item.Name == '点击评论链接'">
          <el-form-item :label="item.Name" :id="item.ID">
            <el-input v-model="item.Content" type="number"></el-input>&nbsp;
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="item.Name == '通过该链接购买'">
          <el-form-item :label="item.Name" :id="item.ID">
            <el-input v-model="item.Content" type="number"></el-input>&nbsp;
          </el-form-item>
        </el-col>
        </div>
      </el-form>
    </el-row>
    <div class="center">
      <el-button type="primary" @click="handleEdit()">保存</el-button>
    </div>
  </div>
</template>
<script>
import qs from "qs";
export default {
  data() {
    return {
      list: {},
      paralist: {},
      editForm: {},
      listrules: {
        Name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http
        .get("api/Back_CurrentManage/CommissionDetail", {
          params: {
            Token: getCookie("token")
          }
        })
        .then(
          function(response) {
            loading.close();
            var status = response.data.Status;
            if (status === 1) {
              this.list = response.data.Result;
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
          function(error) {
            loading.close();
            this.$notify.error({
              title: "错误",
              message: "错误：请检查网络"
            });
          }.bind(this)
        );
    },
    handleEdit() {
      this.paralist = this.list;
      for (let i = 0; i < this.paralist.length; i++) {
        delete this.paralist[i].CreateTime;
        delete this.paralist[i].Name;
        this.paralist[i].value = this.paralist[i].Content;
        delete this.paralist[i].Content;
      }
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http
        .post(
          "api/Back_CurrentManage/CommissionSet",
          qs.stringify({
            token: getCookie("token"),
            List: this.paralist
          })
        )
        .then(
          function(response) {
            loading.close();
            var status = response.data.Status;
            if (status === 1) {
              this.$message({
                showClose: true,
                type: "success",
                message: response.data.Result
              });
              this.getInfo();
            } else if (status === 40001) {
              this.$message({
                showClose: true,
                type: "warning",
                message: response.data.Result
              });
              setTimeout(() => {
                tt.$router.push({
                  path: "/login"
                });
              }, 1500);
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
          function(error) {
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
/* 面包屑 */

.crumb {
  height: 36px;
  line-height: 36px;
}

.block {
  text-align: center;
  padding: 20px 0;
}

.el-row {
  padding: 20px 0px;
}

.title {
  font-size: 22px;
  padding: 15px;
  font-weight: bolder;
}

.el-input {
  width: 50%;
}

.center {
  text-align: center;
  margin-top: 50px;
}
</style>
