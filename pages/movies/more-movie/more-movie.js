var app = getApp();
var util = require("../../../utils/util.js");
// pages/movies/more-movie/more-movie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies:{},
    requestUrl:{},
    totalCount:0,
    isEmpty:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var Movietitle = options.Movietitle;
    var url = "";
    this.setData({
      Movietitle: Movietitle
    })
    if (Movietitle === '正在热映') {
      url = app.globalData.g_commonUrl + "/v2/movie/in_theaters";
    } else if (Movietitle === '即将上映') {
      url = app.globalData.g_commonUrl + "/v2/movie/coming_soon";
    } else {
      url = app.globalData.g_commonUrl + "/v2/movie/top250";
    }
    this.setData({
      requestUrl:url
    });
    util.http(url, this.processData);

  },
  processData: function (moviesData) {
    var movies = [];
    for (var idx in moviesData.subjects) {
      var subject = moviesData.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id,
        stars: util.converToStarsArray(subject.rating.stars)
      }
      movies.push(temp);
    }
    this.data.totalCount += 20;
    var totalMovies = {};
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    }else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    });
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  // onScrollLower:function(event) {
  //   var url = this.data.requestUrl + "?start=" + this.data.totalCount +"&count=20";
  //   wx.showNavigationBarLoading();
  //   util.http(url, this.processData);
  // },
  onReachBottom:function() {
    var url = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    wx.showNavigationBarLoading();
    util.http(url, this.processData);
  },
  onReady: function (options) {
    wx.setNavigationBarTitle({
      title: this.data.Movietitle,
    })
  },
  onPullDownRefresh:function() {
    wx.showNavigationBarLoading();
    var url = this.data.requestUrl + "?start=0&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    wx.showNavigationBarLoading();
    util.http(url, this.processData);
  },
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?movieId=' + movieId,
    })
  }
})