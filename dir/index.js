
// https://www.npmjs.com/package/node-fs-extra
const fs = require('fs-extra');
const path = require('path');
class Dir {
  // E:\work\express-crawler\markDown
  pathUrl = path.resolve(__dirname, '../markDown');
  outPathUrl = path.resolve(__dirname, './markDown.txt');
  outPathUrl1 = path.resolve(__dirname, './markDown.dir.txt');
  constructor() {

  }

  async init() {
    const fileList = await this.readDir()
    const { text, dir } = await this.generate(fileList)
    await this.writeToDir(this.outPathUrl, text)
    await this.writeToDir(this.outPathUrl1, dir)
  }

  // 获取文件夹下目录
  async readDir() {
    console.log(typeof this.pathUrl)
    const files = await fs.readdir(this.pathUrl);
    // console.log(files)
    let fileList = []
    files.forEach((file, index) => {
      const fileName = path.basename(file, '.md');
      fileList.push({
        fileName,
        file,
        order: parseInt(file) ? parseInt(file) : 0
      })
    })
    return fileList
  }

  async generate(fileList) {
    // - [0.Async](0.Async.md)
    fileList = fileList.sort((a, b) => a.order - b.order)
    const text = fileList.reduce((acc, file) => {
      return acc += `- [${file.fileName}](${file.file})\n`
    }, '')
    const dir = fileList.reduce((acc, file) => {
      return acc += `['${file.fileName}', '${file.fileName}'],\n`
    }, '')
    return {
      text,
      dir
    }
  }

  async writeToDir(outPathUrl, text) {
    await fs.outputFile(outPathUrl, text)
  }

}

module.exports = new Dir()