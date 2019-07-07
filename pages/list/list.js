// pages/list/list.js
const fetch = require('../../utils/fetch.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    q: '',
    // 当前加载的分类
    category: {},
    // 此分类下的全部店铺
    shops: [], 
    pageIndex: 0,
    pageSize: 20,
    hasMore: true
  },

  inputChangeHandle(e){
    this.setData({ q: e.detail.value });
  },
  searchHandle(){
    this.setData({ shops: [], pageIndex: 0, hasMore: true });
    this.loadMore()
  },

  loadMore () {
    if (!this.data.hasMore) return;
    let { pageIndex, pageSize, q } = this.data;    
    const params = q ? { _page: ++pageIndex, _limit: pageSize, q } : { _page: ++pageIndex, _limit: pageSize };
    return fetch(`categories/${this.data.category.id}/shops`, params).then(res => {
      const totalCount = parseInt(res.header['X-Total-Count']);
      const hasMore = pageIndex * pageSize < totalCount;
      const shops = this.data.shops.concat(res.data);
      this.setData({ shops, pageIndex,hasMore });
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    fetch(`categories/${options.cat}`).then(res => {
      // console.log(res.data);
      // wx.setNavigationBarTitle({
      //   title: res.data.name,
      // })
      this.setData({ category: res.data });
      wx.setNavigationBarTitle({
        title: res.data.name,
      })

      // 加载完成分类信息过后再去加载商铺信息
      return this.loadMore();
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if(this.data.category.name){
      wx.setNavigationBarTitle({
        title: this.data.category.name
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({ shops: [], pageIndex: 0, hasMore: true });
    this.loadMore().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})