var postsData = require('../../../data/posts-data.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayMusic : false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var globalData = app.g_isPlayMusic;
    var that = this;
    var postid = options.id;
    this.data.currentpostid = postid;
    var postData = postsData.postList[postid];
    this.setData({
      postData:postData
    })

    // var postCollected = {

    // }
    var postCollected = wx.getStorageSync('posts_collected');
    if (postCollected) {
      var collected = postCollected[postid];
      this.setData({
        collected: collected ? collected:false
      })
    }else {
      postCollected = {};
      postCollected[postid] = false;
      wx.setStorageSync('posts_collected', postCollected);
    }

    if(app.globalData.g_isPlayMusic && app.globalData.g_currentMusic === postid) {
      this.setData({
        isPlayMusic:true
      })
    }
    this.setMusic(postid);

  },
  setMusic: function (postid) {
    var that= this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayMusic: true
      })
      app.globalData.g_isPlayMusic = true;
      app.globalData.g_currentMusic = postid;
    })

    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayMusic: false
      })
      app.globalData.g_isPlayMusic = false;
      app.globalData.g_currentMusic = null;
    })

    wx.onBackgroundAudioStop(function() {
      that.setData({
        isPlayMusic: false
      })
      app.globalData.g_isPlayMusic = false;
      app.globalData.g_currentMusic = null;
    })
  },
  onColletionTap:function(event) {
    var postCollected = wx.getStorageSync('posts_collected');
    var post = !postCollected[this.data.currentpostid]
    postCollected[this.data.currentpostid] = post;
    wx.setStorageSync('posts_collected', postCollected);
    this.setData({
      collected:post
    })
    wx:wx.showToast({
      title: post?'收藏成功':"取消成功",
      icon: 'success',
      duration: 1000
    })
  },
  onShareTap:function(event) {
    var itemList = ["分享到微信","分享到朋友圈","分享到微博"]
    wx.showActionSheet({
      itemList: itemList,
      itemColor:"#405f80",
      success:function(res) {
        // res.cancel 用户是否点击了取消
        // res.tapIndex 数组元素的序号，从0开始      
        wx.showModal({
          title: itemList[res.tapIndex],
          content: '无法分享'
        })
      }
    })
  },
  onMusicTap:function(event) {
    var isPlayMusic = this.data.isPlayMusic;
    var currentPostId = this.data.currentpostid;
    if(isPlayMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayMusic:false
      })
    }else {
      wx.playBackgroundAudio({
        dataUrl: postsData.postList[currentPostId].music.url,
        title: postsData.postList[currentPostId].music.title,
        coverImgUrl: postsData.postList[currentPostId].music.coverImg
      })
      this.setData({
        isPlayMusic: true
      })
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
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
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})