var app = getApp();
var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters: {},
    comingSoon: {},
    topUrl:{},
    searchResult:{},
    containerShow:true,
    searchShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var isTheaters = app.globalData.g_commonUrl + "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoon = app.globalData.g_commonUrl + "/v2/movie/coming_soon" + "?start=0&count=3";
    var topUrl = app.globalData.g_commonUrl + "/v2/movie/top250" + "?start=0&count=3";
    this.getMovieData(isTheaters, "isTheaters", "正在热映");
    this.getMovieData(comingSoon, "comingSoon", "即将上映");
    this.getMovieData(topUrl, "topUrl", "电影排行");

  },
  getMovieData: function (url, setKey, Movietitle) {
    var that = this;
    util.http(url, function(data) {
      that.processData(data, setKey, Movietitle);
    })
  },
  processData: function (moviesData, setKey, Movietitle) {
    var movies = [];
    for(var idx in moviesData.subjects) {
      var subject = moviesData.subjects[idx];
      var title = subject.title;
      if(title.length >=6) {
        title = title.substring(0,6)+"...";
      }
      var temp ={
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id,
        stars: util.converToStarsArray(subject.rating.stars)
      }
      movies.push(temp);
    }
    var readyData = {};
    readyData[setKey] = {
      Movietitle: Movietitle,
      movies:movies
    };
    this.setData(readyData);
  },
  moreMovie: function(event) {
    var Movietitle = event.currentTarget.dataset.movietitle;
    wx.navigateTo({
      url: 'more-movie/more-movie?Movietitle=' + Movietitle,
    })
  },
  onBindFocus:function(event) {
    this.setData({
      containerShow:false,
      searchShow:true
    })
  },
  onCancelImgTap:function(event) {
    this.setData({
      containerShow: true,
      searchShow: false,
      searchResult:{}
      // searchResult:{}
    })
  },
  onBindChange:function(event) {
    var text = event.detail.value;
    var searchUrl = app.globalData.g_commonUrl +'/v2/movie/search?q={'+ text +'}';
    this.getMovieData(searchUrl,"searchResult","");
  },
  onMovieTap:function(event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?movieId=' + movieId,
    })
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