const fs = require('fs-extra')
const html2md = require('html-to-md');
const file = './html/index.html'


fs.readFile(file, 'utf8', async function (err, data) {
  console.log(data); //hello!
  const mark = await html2md(data)
  console.log(mark)

  fs.outputFile('./markDown/index1.md', mark, function (err) {
    console.log(err); //null
  })
})

