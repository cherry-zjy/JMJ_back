<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>作品审核列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.sear" placeholder="关键字" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-select v-model="filters.type" placeholder="是否审核通过">
          <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-form-item>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="开始日期" v-model="filters.startTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="1">~</el-col>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="结束时间" v-model="filters.endTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getInfo(false,true)">查询</el-button>
        </el-form-item>
        <el-tag><span @click="filters.pageIndex = 1;getInfo(0)" class="cursur">审核作品共：{{data.Sum}}</span></el-tag>
        <el-tag><span @click="filters.pageIndex = 1;getInfo(1)" class="cursur">通过审核数：{{data.Through}}</span></el-tag>
        <el-tag><span @click="filters.pageIndex = 1;getInfo(2)" class="cursur">未通过审核数：{{data.NotThrough}}</span></el-tag>
        <el-tag><span @click="filters.pageIndex = 1;getInfo(3)" class="cursur">未审核作品共：{{data.Unaudited}}</span></el-tag>
        
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="List" style="width: 100%" :border='true'>

      <el-table-column label="作品名" prop="Name">
      </el-table-column>
      <el-table-column label="作品大图" prop="Image">
        <template slot-scope="scope">
          <img :src="mainurl+scope.row.Image" width="200" />
        </template>
      </el-table-column>
      <el-table-column label="作品作者" prop="Author">
      </el-table-column>
      <el-table-column label="申请时间" prop="CreateTime">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next,jumper" :page-count="pageCount" :current-page="currentPage">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import md5 from "js-md5";

  export default {
    data() {
      return {
        data:[],
        List: [], //列表
        pageCount: 1,
        mainurl: "",
        filters: {
          pageIndex: 1,
          pageSize: 6,
          Token: getCookie("token"),
          type:'0',
          // sear:'',
          // startTime:'',
          // endTime:'',
        },
        
        type: [{
          value: '0',
          label: '是否审核通过（全部）'
        }, {
          value: '2',
          label: '审核未通过'
        }, {
          value: '1',
          label: '审核通过'
        }, {
          value: '3',
          label: '未审核作品'
        }],
      };
    },
    computed: {
      currentPage: function () {
        return this.filters.pageIndex
      }
    },
    methods: {
      /*
           1、获取列表 渲染列表
           2、搜索关键字
           3、分页
        */
      getInfo(type,searchange) {
        
        if (searchange) {
          this.filters.pageIndex = 1
        }
        if (type) {
          this.filters.type = ""+type+""
        }
        if (this.filters.sear == "") {
          delete this.filters.sear
        } else {
          this.filters.sear = this.filters.sear
        }
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        // if (this.filters.startTime == "") {
        //   delete this.filters.startTime
        // } else {
        //   this.filters.startTime = this.filters.startTime
        // }
        // if (this.filters.endTime == "") {
        //   delete this.filters.endTime
        // } else {
        //   this.filters.endTime = this.filters.endTime
        // }
        this.$http
          .get("api/Back_ExamineManager/ProductExamineIndex", {
            params: this.filters
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.List = response.data.Result.prodList;
                this.pageCount = response.data.Result.page;
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
            function (error) {
              loading.close();
              this.$notify.error({
                title: "错误",
                message: "错误：请检查网络"
              });
            }.bind(this)
          );
      },
      getData(){
        this.$http
          .get("api/Back_ExamineManager/DataStatistics", {
            params: {
              type:1,
              Token:getCookie("token")
            }
          })
          .then(
            function (response) {
              var status = response.data.Status;
              if (status === 1) {
                this.data = response.data.Result;
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
          // 请求error
          .catch(
            function (error) {
              this.$notify.error({
                title: "错误",
                message: "错误：请检查网络"
              });
            }.bind(this)
          );
      },
      //
      // 分页
      handleCurrentChange(val) {
        this.filters.pageIndex = val;
        this.getInfo();
      },
      //详情
      handleEdit(index, row) {
        console.log(Object.assign({}, row));
        var obj = Object.assign({}, row);
        var urlId = obj.ID;
        this.$router.push("/examine/ProductExamineDetail/id=" + urlId);
      },
    },
    mounted() {
      this.mainurl = mainurl;
      this.getInfo();
      this.getData();
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
  .cursur{
    cursor: pointer;
  }

</style>
