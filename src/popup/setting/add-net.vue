<template>
  <div class="wallet-container">
    <nav-layout class="u-full-height">
      <div class="title">
        <span>{{ $t('setting.index.net') }}</span>
      </div>

      <template>
        <wallet-input
          v-model="name"
          :label="$t('setting.index.name')"
          :placeholder="$t('setting.index.holderName')"
          type="text"
          :pattern="/^\S{0,}$/"
        ></wallet-input>
        
        <wallet-input
          v-model="url"
          :label="$t('setting.index.rpc')"
          :placeholder="$t('setting.index.holderUrl')"
          type="text"
          :pattern="/^\S{0,}$/"
        ></wallet-input>

        <div class="btnView">
          <button :disabled="!name || !url" class="display-block btn-primary" @click="save">{{$t('common.confirm')}}</button>
        </div>
      </template>
    </nav-layout>
  </div>
</template>

<style lang="scss" scoped>
@import "./header-tab.scss";
.title {
  font-size: 20px;
  color: #21274a;
  line-height: 28px;
  font-weight: 500;
  margin-bottom: 30px;
}
.section {
  span {
    color: #717680;
    font-size: 15px;
    line-height: 30px;
  }
  input {
    width: 100%;
    margin: 0;
  }
  margin-top: 24px;
}
.btnView {
  margin-top: 60px;
  display: flex;
  justify-content: center;
  div {
    width: 164px;
    line-height: 48px;
    font-size: 16px;
    text-align: center;
    color: #5b5f67;
    border-radius: 3px;
  }
  .cancel {
    border: #b4bccc 1px solid;
    background: white;
    margin-right: 16px;
  }
  .save {
    border: none;
    background: #004eec;
    color: white;
  }
}
</style>

<script type="text/jsx">
import NavLayout from "../components/nav-layout";
import WalletInput from "../components/input";
import axios from "axios";
export default {
  name: "setting",

  components: {
    NavLayout,
    WalletInput
  },

  methods: {
    save() {
      this.checkUrl();
      return;
    },
    cancel() {
      this.$router.go(-1);
    },
    checkUrl() {
      if (this.name.trim().length > 50) {
        this.$toast(this.lang === 'zh' ? '不超过50个字符' : "Maximum length is 50 characters");
        return;
      }
      if (this.netList.find(item => item.name === this.name.trim())) {
        this.$toast(this.lang === 'zh' ? '已存在' : "Exist already");
        return;
      }
      this.$loading("Checking...");
      axios
        .post(this.url.trim() + "/block/getinfo", {})
        .then(res => {
          this.$loading.close();
          const net = res.data.data.nettype;
          if (net === "MAIN_NET") {
            this.add("mainnet");
          } else {
            this.add("testnet");
          }
        })
        .catch(err => {
          this.$loading.close();
          this.$toast(this.lang === 'zh' ? 'url不正确' : "Invalid url");
        });
    },
    add(network) {
      const netItem = {
        name: this.name,
        url: this.url,
        network: network
      };
      if (!this.netList) {
        this.netList = [];
      }
      this.netList.push(netItem);
      localStorage.setItem("netList", JSON.stringify(this.netList));
      this.$toast(this.$t("account.addToken.addSuccess"));
      this.$router.go(-1);
    }
  },

  data() {
    return {
      netList: [],
      name: "",
      url: "",
      lang: this.$i18n.locale.indexOf('zh') > -1 ? 'zh' : 'en'
    };
  },
  created() {
    console.log(this.$i18n.locale)
    this.netList = localStorage.getItem("netList") ? JSON.parse(localStorage.getItem("netList")) : [];
  }
};
</script>
