
const cheerio = require('cheerio');
const axios = require('axios').default;
const fs = require('fs-extra');
const path = require('path');
const html2md = require('html-to-md');

class Craw {
  // 获取总文章的地址
  url = `http://www.zhufengpeixun.com/front/index.html`;
  // 文章列表
  articleList = [];
  constructor() {

  }



  async init() {
    // 获取所有文章列表
    await this.getAllAticle();
    const articleList = this.articleList;
    console.log(articleList)
    for (let index = 0; index < articleList.length; index++) {
      const article = articleList[index];
      console.log(`开始爬取${article}文章内容`)
      await this.download(article)
    }
  }





  // 解析Html正文内容
  async resolveHtml(html) {
    const $ = cheerio.load(html);
    const wrap = $('.markdown-body').html();
    return wrap
  }

  // 获取所有的文章列表
  async getAllAticle() {
    const { data } = await this.getHtml(this.url)
    const $ = cheerio.load(data);
    const liDom = $('.nav li a');
    const articleList = []
    liDom.each(function (index, item) {
      let text = $(this).text();
      if (text != '0.api') {
        articleList.push(text)
      }
    })
    this.articleList = articleList
  }

  /**
   *  从每个url中获取html内容
   * @param {*} url 
   * @returns 
   */
  async getHtml(url) {
    try {
      const { data } = await axios.get(url)
      return {
        data,
        msg: "获取数据成功",
        status: 200
      }
    } catch {
      return {
        data: null,
        msg: "获取数据失败",
        status: 0
      }
    }
  }

  // 下载网页
  async download(articleListUrl) {
    const url = `http://www.zhufengpeixun.com/front/html/${articleListUrl}.html`;
    console.log(`文章地址：${url}`)
    const { data, status } = await this.getHtml(url);
    if (status && data) {
      console.log(`开始获取${articleListUrl}文章的内容主体`)
      const wrap = await this.resolveHtml(data);
      console.log(`开始把${articleListUrl}文章的内容主体转化成MD文件`)
      const mark = await html2md(wrap);
      await this.outputFile(mark, articleListUrl);
      console.log('MD 下载成功')
    }
  }


  async outputFile(Html, articleListUrl) {
    const fileUrl = path.resolve(process.cwd(), `front/${articleListUrl}.md`);
    console.log(`开始把${articleListUrl}MD文件输出到${fileUrl}`)
    await fs.outputFile(fileUrl, Html);
  }
}



module.exports = new Craw()